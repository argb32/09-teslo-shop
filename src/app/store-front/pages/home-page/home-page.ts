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

  productServive = inject(ProductsService);

  productResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productServive.getProducts({})
    }
  })

  imageResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productServive.getImage('')
    }
  })


}
