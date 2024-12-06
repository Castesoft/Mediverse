import { CommonModule } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { Account } from "src/app/_models/account/account";
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'div[userProfilePicture]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-picture.component.html',
})
export class UserProfilePictureComponent {
  utilsService = inject(UtilsService);

  account = model.required<Account | null>();

  shape = input<'circle' | 'square'>('circle');
  size = input<'sm' | 'md' | 'md2' | 'lg'>('sm');
  showOnline = input<boolean>(false);
}
