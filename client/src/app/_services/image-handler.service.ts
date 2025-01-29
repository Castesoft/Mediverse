import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Photo } from "src/app/_models/forms/example/_models/photo";

@Injectable({ providedIn: 'root' })
export class ImageHandlerService {
  private imagesSubject: BehaviorSubject<Photo[]> = new BehaviorSubject<Photo[]>([]);
  private mainImageIndexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private errorSubject: Subject<string> = new Subject<string>();

  images$: Observable<Photo[]> = this.imagesSubject.asObservable();
  mainImageIndex$: Observable<number> = this.mainImageIndexSubject.asObservable();
  errors$: Observable<string> = this.errorSubject.asObservable();

  initialize(photos: Photo[] = []): void {
    let images: Photo[] = [];
    let mainIndex: number = -1;

    if (photos.length) {
      images = photos.map((photo: Photo) => ({
        ...photo,
        isMain: photo.isMain ?? false
      }));

      mainIndex = photos.findIndex((photo: Photo) => photo.isMain);
      if (mainIndex === -1) {
        mainIndex = 0;
      }
    }

    this.imagesSubject.next(images);
    this.mainImageIndexSubject.next(mainIndex);
  }

  handleFiles(files: File[], maxFiles: number = 10, maxSizeMB: number = 5): void {
    const currentImages: Photo[] = this.imagesSubject.value;
    const availableSlots: number = maxFiles - currentImages.length;

    if (files.length > availableSlots) {
      this.errorSubject.next(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const newImages: Photo[] = files
      .filter((file: File) => {
        if (file.size > this.mbToBytes(maxSizeMB)) {
          this.errorSubject.next(`File ${file.name} exceeds ${maxSizeMB}MB`);
          return false;
        }
        return true;
      })
      .map((file: File, index: number) => ({
        file,
        url: URL.createObjectURL(file),
        isMain: currentImages.length === 0 && index === 0
      } as Photo));

    this.imagesSubject.next([ ...currentImages, ...newImages ]);
    this.updateMainImage();
  }

  removeImage(index: number): void {
    const images: Photo[] = [ ...this.imagesSubject.value ];
    if (index < 0 || index >= images.length) return;

    const removedImage: Photo = images[index];

    if (removedImage.id) {
      images[index] = { ...removedImage, url: undefined };
    } else {
      if (removedImage.url) {
        URL.revokeObjectURL(removedImage.url);
      }
      images.splice(index, 1);
    }

    this.imagesSubject.next(images);

    if (removedImage.isMain) {
      this.updateMainImage();
    }
  }

  setMainImage(index: number): void {
    const images: Photo[] = this.imagesSubject.value;
    if (index < 0 || index >= images.length) {
      this.errorSubject.next('Invalid main image index');
      return;
    }

    const updatedImages = images.map((img, i) => ({
      ...img,
      isMain: i === index
    }));

    this.imagesSubject.next(updatedImages);
    this.mainImageIndexSubject.next(index);
  }

  private updateMainImage(): void {
    const validImages: Photo[] = this.imagesSubject.value.filter((img: Photo) =>
      img.url || img.file
    );

    if (!validImages.some((img: Photo) => img.isMain)) {
      const newIndex: -1 | 0 = validImages.length > 0 ? 0 : -1;
      if (newIndex !== -1) {
        this.setMainImage(newIndex);
      } else {
        this.mainImageIndexSubject.next(-1);
      }
    }
  }

  private mbToBytes(mb: number): number {
    return mb * 1024 * 1024;
  }

  getImages(): Photo[] {
    return this.imagesSubject.value;
  }

  getMainImageIndex(): number {
    return this.mainImageIndexSubject.value;
  }

  getMainImage(): Photo | undefined {
    const index: number = this.mainImageIndexSubject.value;
    return this.imagesSubject.value[index] || undefined;
  }

  getRemovedIds(): string[] {
    return this.imagesSubject.value
      .filter((img: Photo) => img.id && !img.url)
      .map((img: Photo) => img.id!.toString());
  }

  destroy(): void {
    this.imagesSubject.value.forEach(img => {
      if (img.url && !img.id) {
        URL.revokeObjectURL(img.url);
      }
    });
  }
}
