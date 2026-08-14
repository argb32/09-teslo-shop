import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ProductsResponse } from '../interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.baseUrl

interface Options {
  limit?: number,
  offset?: number,
  gender?: string,
}

@Service()
export class ProductsService {

  private http = inject(HttpClient);


  getProducts(options: Options): Observable<ProductsResponse> {
    //configuramos las opciones de la peticion por defecto si no vienen especificadas
    const { limit = 9, offset = 0, gender = '' } = options;


    return this.http.get<ProductsResponse>(`${BASE_URL}/products`, {
      params: {
        limit,
        offset,
        gender,
      }
    })
      .pipe(tap(resp => console.log(resp)));


  }

  getImage(url: string) {
    return this.http.get(`${BASE_URL}/product/${url}`)
  }


}
