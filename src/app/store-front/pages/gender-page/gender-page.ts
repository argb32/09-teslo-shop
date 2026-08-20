import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '../../../products/services/products.service';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GenderPage {
  paginationService = inject(PaginationService);
  route = inject(ActivatedRoute);
  productService = inject(ProductsService);

  gender = toSignal<string>(
    this.route.params.pipe(
      //gender de la izquierda y el de la derecha no son exactamente lo mismo.
      //this.route.params podría emitir:
      //{
      //   gender: 'men'
      // }
      map(({ gender }) => gender),
    ),
  );

  productResource = rxResource({
    params: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage() - 1,
    }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        gender: params.gender,
        offset: params.page * 9,
      });
    },
  });
}
