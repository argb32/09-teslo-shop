import { Component, inject } from '@angular/core';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from "../../../shared/components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  imports: [ProductCard, Pagination],
})
export class HomePage {

  productService = inject(ProductsService);

  activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(

      map(params => params.get('page') ? +params.get('page')! : 1),
      map(page => isNaN(page) ? 1 : page)
    ),
    {
      initialValue: 1,
    }
  )




  productResource = rxResource({
    params: () => ({ page: this.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: params.page * 9
      })
    }
  })




}
