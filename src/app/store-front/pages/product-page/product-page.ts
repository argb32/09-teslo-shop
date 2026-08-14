import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { ProductCarousel } from "../../../products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProductPage {

  //para recibil la ruta necesitamos ActivatedRoute
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService)

  //snapshot porque no necesita ser dinamicao
  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    params: () => ({ idSlug: this.productIdSlug }),
    stream: ({ params }) => {
      return this.productService.getProductByIdSlug(params.idSlug)
    }
  })
  //En este caso no es dinamico y tambien funcionaria sin params. Pero
  // es bueno hacerlo de la forma de arriba ya que si cambiasen los params
  // se dispara el loader automaticamente.
  // productResource = rxResource({
  //   params: () => ({}),
  //   stream: ({ }) => this.productService.getProductByIdSlug(this.productIdSlug)

  // })


}
