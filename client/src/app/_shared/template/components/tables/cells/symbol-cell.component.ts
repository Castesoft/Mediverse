import { Component, input, InputSignal } from "@angular/core";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  host: { class: 'align-middle flex-column-fluid border-none' },
  selector: "td[symbolCell], div[symbolCell]",
  templateUrl: "./symbol-cell.component.html",
  standalone: true,
})
export class SymbolCellComponent {
  photoUrl: InputSignal<string | null> = input.required<string | null>();

  shape: InputSignal<PhotoShape> = input<PhotoShape>(PhotoShape.CIRCLE);
  size: InputSignal<PhotoSize> = input<PhotoSize>(PhotoSize.SMALL);
  showOnline: InputSignal<boolean> = input<boolean>(false);

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const originalSrc = imgElement.src;

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
