import { Component, model } from '@angular/core';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { CommonModule } from '@angular/common';
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
@Component({
  selector: 'div[doctorReviewsTab]',
  templateUrl: './doctor-reviews-tab.component.html',
  imports: [ProfilePictureComponent, CommonModule, ],
  standalone: true,
})
export class DoctorReviewsTabComponent {

  doctor = model.required<DoctorResult | null>();

  convertToStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
