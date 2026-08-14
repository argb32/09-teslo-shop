import { Component, inject } from '@angular/core';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from "../../../shared/components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  imports: [ProductCard, Pagination],
})
export class HomePage {

  productService = inject(ProductsService);
  paginationService = inject(PaginationService);





  productResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: params.page * 9
      })
    }
  })




}
