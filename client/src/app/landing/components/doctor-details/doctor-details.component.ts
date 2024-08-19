import { Component, input, output } from '@angular/core';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { UserProfilePictureComponent } from "../../../users/components/user-profile-picture/user-profile-picture.component";
import { DoctorGeneralTabComponent } from '../doctor-general-tab/doctor-general-tab.component';
import { DoctorScheduleTabComponent } from '../doctor-schedule-tab/doctor-schedule-tab.component';
import { DoctorReviewsTabComponent } from '../doctor-reviews-tab/doctor-reviews-tab.component';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [UserProfilePictureComponent, UserProfilePictureComponent, DoctorGeneralTabComponent, DoctorScheduleTabComponent, DoctorReviewsTabComponent],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.scss'
})
export class DoctorDetailsComponent {
  doctor = input<DoctorSearchResult>();
  onClose = output();

  selectedTab = 'general';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
