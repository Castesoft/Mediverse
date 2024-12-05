import { Component, model } from '@angular/core';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { CommonModule } from '@angular/common';
import { DoctorResult } from "src/app/_models/doctorResults/doctorResult";
@Component({
  selector: 'div[doctorReviewsTab]',
  templateUrl: './doctor-reviews-tab.component.html',
  imports: [UserProfilePictureComponent, CommonModule, ],
  standalone: true,
})
export class DoctorReviewsTabComponent {

  doctor = model.required<DoctorResult | null>();

  convertToStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
