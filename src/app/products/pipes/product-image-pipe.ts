import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.baseUrl}/files/product`;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {



    if (value === null) return './assets/images/placeholder-images/no-image.jpg';
    //condicion para manejar las imagenes nuevas que añadimos a traves de addFiles
    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }

    if (typeof (value) === 'string') return `${BASE_URL}/${value}`;

    if (!value.at(0)) return './assets/images/placeholder-images/no-image.jpg';

    return `${BASE_URL}/${value.at(0)}`


  }
}
