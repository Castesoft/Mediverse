import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'div[userProfilePicture]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-picture.component.html',
})
export class ProfilePictureComponent {
  utilsService = inject(UtilsService);

  fullName = input.required<string | null>();
  photoUrl = input<string | null>(null);

  shape = input<'circle' | 'square'>('circle');
  size = input<'sm' | 'md' | 'md2' | 'lg'>('sm');
  showOnline = input<boolean>(false);
}
