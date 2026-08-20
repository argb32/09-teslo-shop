import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  Gender,
  Product,
  ProductsResponse,
} from '../interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Service()
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    //configuramos las opciones de la peticion por defecto si no vienen especificadas
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    //con esto buscamos si la key existe, y en caso afirmativo devolvemos los productos in hacer una nueva consulta a la api
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug))
      return of(this.productCache.get(idSlug)!);

    return this.http
      .get<Product>(`${BASE_URL}/products/${idSlug}`)
      .pipe(tap((resp) => this.productCache.set(idSlug, resp)));
  }

  getPoductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id))
      return of(this.productCache.get(id)!);

    return this.http
      .get<Product>(`${BASE_URL}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(id, resp)));
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList,
  ): Observable<Product> {
    return this.http.post<Product>(
      `${BASE_URL}/products`,
      productLike,
    );
  }

  //Como guardamos los productos en el caché para no hacer multiples peticiones hay que limpiarlo al hacer un update
  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList,
  ): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList).pipe(
      map((imageName) => ({
        ...productLike,
        images: [...currentImages, ...imageName],
      })),
      //ahora necesitamos llamar a la petición http, para eso disponemos del operador rxjs switchMap
      switchMap((updatedProduct) =>
        this.http.patch<Product>(
          `${BASE_URL}/products/${id}`,
          updatedProduct,
        ),
      ),
      tap((product) => this.updateProductCache(product)),
    );

    // return this.http.patch<Product>(`${BASE_URL}/products/${id}`, productLike)
    //   .pipe(tap(product => this.updateProductCache(product)));
  }

  //todo: cargar imagenes en la creacion de productos como se hace en el update.
  //podriamos hacer un metodo para actualizar el cache en la creacion de producto que no haga la segunda parte de este método
  updateProductCache(product: Product) {
    const productId = product.id;

    //esto para actualizar el cache del producto (singular)
    this.productCache.set(productId, product);

    //esto para el caché de los productos
    //en el cache tenemos un arreglo de productos, por lo que tenemos que recorrelo
    //y buscar el id que coincida
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currenProduct) => {
          return currenProduct.id === productId
            ? product
            : currenProduct;
        },
      );
    });
  }

  //Necesitamos algo que tome un FileList y lo suba al back a traves de la api
  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    console.log({ images });
    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile),
    );

    //tenemos que esperar a que terminen de subirse todas las imágenes, y como no son promesas sino observables
    //existe una funcion de rxjs llamada forkJoin.
    return forkJoin(uploadObservables);
  }

  //El backend solo acepta la subida de una imagen a la vez, por lo que es necesario esta función.
  uploadImage(imageFile: File): Observable<string> {
    //el formData es algo propio de JS y lo que estamos creando es el body de la request de typo formData
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(
        `${BASE_URL}/files/product`,
        formData,
      )
      .pipe(map((resp) => resp.fileName));
  }
}
