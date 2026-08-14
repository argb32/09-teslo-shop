import { Component, inject } from '@angular/core';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  imports: [ProductCard],
})
export class HomePage {

  productService = inject(ProductsService);

  productResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productService.getProducts({})
    }
  })




}
