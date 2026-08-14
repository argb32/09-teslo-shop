import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '../../../products/services/products.service';
import { ProductCard } from "../../../products/components/product-card/product-card";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard],
  templateUrl: './gender-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GenderPage {
  route = inject(ActivatedRoute);
  productService = inject(ProductsService);

  gender = toSignal<string>(
    this.route.params.pipe(
      //gender de la izquierda y el de la derecha no son exactamente lo mismo.
      //this.route.params podría emitir:
      //{
      //   gender: 'men'
      // }
      map(({ gender }) => gender)
    )
  )


  productResource = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        gender: params.gender
      })
    }
  })
}
