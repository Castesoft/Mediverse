import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { UtilsService } from 'src/app/_services/utils.service';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: 'div[userProfilePicture]',
  templateUrl: './profile-picture.component.html',
  styleUrls: [ './profile-picture.component.scss' ],
  imports: [ CommonModule ],
})
export class ProfilePictureComponent {
  private utilsService: UtilsService = inject(UtilsService);

  fullName: InputSignal<string | null> = input.required<string | null>();
  photoUrl: InputSignal<string | null> = input<string | null>(null);
  shape: InputSignal<PhotoShape> = input<PhotoShape>(PhotoShape.CIRCLE);
  size: InputSignal<PhotoSize> = input<PhotoSize>(PhotoSize.SMALL);
  showOnline: InputSignal<boolean> = input<boolean>(false);

  protected symbolClasses: Signal<string> = computed(() => {
    const classes: string[] = [ 'symbol' ];

    if (this.shape() === 'circle') {
      classes.push('symbol-circle');
    }

    switch (this.size()) {
      case 'sm':
        classes.push('symbol-50px', 'min-w-50px');
        break;
      case 'md':
        classes.push('symbol-100px', 'min-w-100px');
        break;
      case 'md2':
        classes.push('symbol-125px', 'min-w-125px');
        break;
      case 'lg':
        classes.push('symbol-160px', 'min-w-160px');
        break;
    }

    return classes.join(' ');
  });

  protected labelClasses: Signal<string> = computed(() => {
    if (!this.fullName()) return '';

    const bootstrapClass: string = this.utilsService.getBootstrapClass(this.fullName()!);
    const classes: string[] = [
      'symbol-label',
      'fw-semibold',
      `text-primary`,
      `bg-light-${bootstrapClass}`,
      `text-${bootstrapClass}`
    ];

    if (this.size() === 'sm') {
      classes.push('fs-3');
    } else {
      classes.push('fs-2x');
    }

    return classes.join(' ');
  });

  protected hasValidFullName(): boolean {
    return this.fullName() !== null && this.fullName() !== '';
  }

  protected getInitial(): string {
    return this.fullName() ? this.fullName()!.charAt(0) : '';
  }
}
