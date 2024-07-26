import { Component, input } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-user-profile-picture',
  standalone: true,
  imports: [],
  templateUrl: './user-profile-picture.component.html',
  styleUrl: './user-profile-picture.component.scss'
})
export class UserProfilePictureComponent {

  user = input.required<User>();
  bootstrapClass = 'success';

  ngOnInit(): void {
    this.bootstrapClass = this.getBootstrapClass(this.user().firstName);
  }

  bootstrapClasses = [
    'success',
    'danger',
    'info',
    'primary',
    // 'secondary',
    'warning',
    'light',
    'dark'
  ];

  getBootstrapClass(name: string) {
    const asciiSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const classIndex = asciiSum % this.bootstrapClasses.length;

    return this.bootstrapClasses[classIndex];
  }

}
