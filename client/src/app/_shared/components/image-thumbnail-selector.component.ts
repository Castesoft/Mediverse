import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal
} from "@angular/core";
import { PhotoShape, PhotoSize } from "../../_models/photos/photoTypes";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { Photo } from "src/app/_models/forms/example/_models/photo";
import { ImageHandlerService } from "src/app/_services/image-handler.service";

@Component({
  selector: "div[imageThumbnailSelector]",
  standalone: true,
  templateUrl: "./image-thumbnail-selector.component.html",
  styleUrls: [ "./image-selector.component.scss" ],
  imports: [ SymbolCellComponent, TooltipDirective ]
})
export class ImageThumbnailSelectorComponent {
  imageHandler: ImageHandlerService = inject(ImageHandlerService);

  maxFiles: InputSignal<number> = input(10);
  maxFileSizeMB: InputSignal<number> = input(5);
  image: InputSignal<Photo | undefined> = input();
  editable: InputSignal<boolean> = input(true);
  singleSelect: InputSignal<boolean> = input(false);
  allowedTypes: InputSignal<string> = input('image/*');
  thumbnailSize: InputSignal<PhotoSize> = input(PhotoSize.EXTRA_LARGE as PhotoSize);
  thumbnailShape: InputSignal<PhotoShape> = input(PhotoShape.SQUARE as PhotoShape);

  effectiveMaxFiles: Signal<number> = computed(() => this.singleSelect() ? 1 : this.maxFiles());

  filesChanged: OutputEmitterRef<File[]> = output();

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: File[] = Array.from(input.files || []);
    this.handleFiles(files);
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    if (!this.editable()) return;

    if (this.singleSelect()) {
      this.imageHandler.initialize([]);
      const filesToAdd: File[] = files.slice(0, 1);
      this.imageHandler.handleFiles(filesToAdd, this.effectiveMaxFiles(), this.maxFileSizeMB());
    } else {
      this.imageHandler.handleFiles(files, this.effectiveMaxFiles(), this.maxFileSizeMB());
    }

    this.filesChanged.emit(files);
  }

  hasRealImages(): boolean {
    return this.imageHandler.getImages().some((img: Photo) => !!img.url || !!img.file);
  }

  getSymbolString(): string | null {

    const mainImage = this.imageHandler.getMainImage();

    if (
      mainImage !== undefined &&
      mainImage.url !== undefined
    ) {
      return mainImage.url;
    }

    const images = this.imageHandler.getImages();

    if (
      images.length &&
      images.length > 0 &&
      images[0].url !== undefined
    ) {
      return images[0].url;
    }

    return null;

  }

}
