import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Account } from 'src/app/_models/account';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-user-profile-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-picture.component.html',
  styleUrl: './user-profile-picture.component.scss'
})
export class UserProfilePictureComponent {

  photoUrl = input<string>('');
  firstName = input<string>('');
  shape = input<'circle' | 'square'>('circle');
  size = input<'sm' | 'md' | 'md2' | 'lg'>('sm');
  showOnline = input<boolean>(false);
  bootstrapClass = 'success';

  ngOnInit(): void {
    this.bootstrapClass = this.getBootstrapClass(this.firstName());
  }

  bootstrapClasses = [
    'success',
    'danger',
    'info',
    'primary',
    'warning',
    'dark'
    // 'secondary', No son visibles
    // 'light',
  ];

  getBootstrapClass(name: string) {
    const asciiSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const classIndex = asciiSum % this.bootstrapClasses.length;

    return this.bootstrapClasses[classIndex];
  }

}
