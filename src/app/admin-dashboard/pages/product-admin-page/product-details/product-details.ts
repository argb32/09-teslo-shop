import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarousel } from "../../../../products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabel } from "../../../../shared/components/form-error-label/form-error-label";
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';

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
  onSubmit() {

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

    //todo: creacion de nuevo producto
    if (this.product().id === 'new') {
      //crear
      this.productsService.createProduct(productLike).subscribe((product) => {
        console.log('se ha creado un producto');
        this.router.navigate(['/admin/products', product.id])
      });

    } else {
      this.productsService.updateProduct(this.product().id, productLike).subscribe(
        product => {
          console.log('Producto actualizado')
        }
      );
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


}
