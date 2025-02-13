import { Component, InputSignal, model } from '@angular/core';
import { Product } from "src/app/_models/products/product";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: 'div[productGridCard]',
  templateUrl: './product-grid-card.component.html',
  styleUrl: './product-grid-card.component.scss',
  imports: [ CurrencyPipe ],
})
export class ProductGridCardComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;

  product: InputSignal<Product> = model.required();

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const originalSrc: string = imgElement.src;

    if (originalSrc !== 'media/misc/not-found.png') {
      imgElement.src = 'media/misc/not-found.png';
    } else {
      console.warn(`Failed to load image: ${originalSrc}`);
      console.warn('Fallback image also not found. Displaying alt text.');

      imgElement.removeAttribute('src');
      imgElement.classList.add('image-not-found');
    }
  }
}
