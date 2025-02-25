import { Component, model, ModelSignal } from '@angular/core';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { CommonModule } from '@angular/common';
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: 'div[doctorReviewsTab]',
  templateUrl: './doctor-reviews-tab.component.html',
  imports: [ ProfilePictureComponent, CommonModule, ],
})
export class DoctorReviewsTabComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  doctor: ModelSignal<DoctorResult | null> = model.required();

  convertToStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
