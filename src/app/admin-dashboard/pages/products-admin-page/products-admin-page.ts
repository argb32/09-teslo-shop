import { Component, inject, signal } from '@angular/core';
import { ProductTable } from "../../../products/components/product-table/product-table";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../../products/services/products.service';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { Pagination } from "../../../shared/components/pagination/pagination";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productService = inject(ProductsService);
  paginationService = inject(PaginationService);


  productsPerPage = signal(10);


  productResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage()
    }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: params.page * 9,
        limit: params.limit
      })
    }
  })
}
