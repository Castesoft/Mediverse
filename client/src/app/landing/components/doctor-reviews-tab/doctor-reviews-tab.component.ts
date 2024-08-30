import { Component, input } from '@angular/core';
import { DoctorReview } from 'src/app/_models/doctorSearchResults';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-doctor-reviews-tab',
  standalone: true,
  imports: [UserProfilePictureComponent, DatePipe],
  providers: [DatePipe],
  templateUrl: './doctor-reviews-tab.component.html',
  styleUrl: './doctor-reviews-tab.component.scss'
})
export class DoctorReviewsTabComponent {

  reviews = input.required<DoctorReview[]>();

  convertToStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
