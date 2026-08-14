import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProductPage {

  //para recibil la ruta necesitamos ActivatedRoute
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService)

  //snapshot porque no necesita ser dinamicao
  productIdSlug = this.activatedRoute.snapshot


}
