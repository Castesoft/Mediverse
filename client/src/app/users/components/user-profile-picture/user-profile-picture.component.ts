import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Account } from 'src/app/_models/account';
import { User } from 'src/app/_models/user';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-user-profile-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-picture.component.html',
  styleUrl: './user-profile-picture.component.scss'
})
export class UserProfilePictureComponent {
  utilsService = inject(UtilsService);

  photoUrl = input<string>('');
  firstName = input<string>('');
  shape = input<'circle' | 'square'>('circle');
  size = input<'sm' | 'md' | 'md2' | 'lg'>('sm');
  showOnline = input<boolean>(false);
}
