import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';

// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductImagePipe } from '../../pipes/product-image-pipe';


@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
  .swiper {
    width: 100%;
    height: 100%;
  }

  `
})
export class ProductCarousel implements AfterViewInit, OnChanges {
  // const swiper = new Swiper(...);

  images = input.required<string[]>()

  //para tener una referencia a aun div hacemos lo siguiente.
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper | undefined = undefined;



  ngOnChanges(changes: SimpleChanges): void {
    //si es la primera vez que se carga el swiper no hacer nada
    if (changes['images'].firstChange) return
    //si el swiper todavia no existe no hacer nada
    if (!this.swiper) return

    //si no es el priemer cambio, destruimos el swipper y lo reinicializamos
    this.swiper.destroy(true, true);
    this.swiperInit();

  }


  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [Navigation, Pagination],
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

  }



}
