import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';
import { UtilsService } from 'src/app/_services/utils.service';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: 'div[userProfilePicture]',
  imports: [ CommonModule ],
  standalone: true,
  templateUrl: './profile-picture.component.html',
})
export class ProfilePictureComponent {
  utilsService: UtilsService = inject(UtilsService);

  fullName: InputSignal<string | null> = input.required<string | null>();
  photoUrl: InputSignal<string | null> = input<string | null>(null);

  shape: InputSignal<PhotoShape> = input<PhotoShape>(PhotoShape.CIRCLE);
  size: InputSignal<PhotoSize> = input<PhotoSize>(PhotoSize.SMALL);
  showOnline: InputSignal<boolean> = input<boolean>(false);
}
