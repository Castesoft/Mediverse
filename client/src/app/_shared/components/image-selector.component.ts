import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { PhotoShape, PhotoSize } from 'src/app/_models/photos/photoTypes';
import { ImageHandlerService } from "src/app/_services/image-handler.service";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { Photo } from "src/app/_models/forms/example/_models/photo";

@Component({
  selector: 'div[imageSelector]',
  templateUrl: './image-selector.component.html',
  styleUrls: [ './image-selector.component.scss' ],
  imports: [ SymbolCellComponent ]
})
export class ImageSelectorComponent {
  imageHandler: ImageHandlerService = inject(ImageHandlerService);

  maxFiles: InputSignal<number> = input(10);
  maxFileSizeMB: InputSignal<number> = input(5);
  allowedTypes: InputSignal<string> = input('image/*');
  editable: InputSignal<boolean> = input(true);
  thumbnailSize: InputSignal<PhotoSize> = input(PhotoSize.LARGE as PhotoSize);
  thumbnailShape: InputSignal<PhotoShape> = input(PhotoShape.SQUARE as PhotoShape);

  filesChanged: OutputEmitterRef<File[]> = output();
  isDragging: boolean = false;

  constructor() {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files: File[] = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: File[] = Array.from(input.files || []);
    this.handleFiles(files);
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    if (!this.editable()) return;
    this.imageHandler.handleFiles(files, this.maxFiles(), this.maxFileSizeMB());
    this.filesChanged.emit(files);
  }

  hasRealImages(): boolean {
    return this.imageHandler.getImages().some((img: Photo) => !!img.url || !!img.file);
  }
}
