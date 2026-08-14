import { Component, computed, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product } from '../../interfaces/product.interface';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  imageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/${this.product().images[0]}`
  });
}
