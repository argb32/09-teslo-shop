import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarousel } from "../../../../products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabel } from "../../../../shared/components/form-error-label/form-error-label";
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();
  productsService = inject(ProductsService)
  router = inject(Router);

  fb = inject(FormBuilder);

  wasSaved = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

  allImages = computed<string[]>(() => [...this.product().images, ...this.tempImages()]);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],

  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL',];

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(',') })
    // this.productForm.reset(this.product() as any)


  }

  //tenemos que hacer el metodo async para poder mostrar el modal de succes durante 2 seg
  async onSubmit() {

    const isValid = this.productForm.valid
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;


    //partial es un Ojecto (product en este caso) que tiene sus campos opcionales
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag) => tag.trim()) ?? [],

    };

    if (this.product().id === 'new') {

      //crear
      //firstvalueFrom recibe un observable y devuelve una promesa (necesario para el modal de success)
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['/admin/products', product.id]);

    } else {
      //sera necesario un try catch para manejar el error
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );

      //sin modal de success que se tiene que ir en un tirmpo determinado
      // this.productsService.updateProduct(this.product().id, productLike).subscribe(
      //   product => {
      //     console.log('Producto actualizado')
      //   }
      // );

      this.wasSaved.set(true);
      setTimeout(() => {
        this.wasSaved.set(false);
      }, 3000)

    }


  }

  onSizeClicked(size: string) {

    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes })

  }

  //Images
  onFilesChanged(event: Event) {
    //recibimos los files desde el event y los guardamos en una variable
    //esto nos devuelve un objeto no un array (con la simagenes dentro)
    const fileList = (event.target as HTMLInputElement).files;

    this.imageFileList = fileList ?? undefined;


    //De esta manera se genera un url de las imagenes para poder usarlas directamente en el navegador
    const imagesUrls = Array.from(fileList ?? []).map(file =>
      URL.createObjectURL(file)
    );

    this.tempImages.set(imagesUrls)


  }

}
