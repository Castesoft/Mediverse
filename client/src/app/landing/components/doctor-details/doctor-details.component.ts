import { Component, input, output } from '@angular/core';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { UserProfilePictureComponent } from "../../../users/components/user-profile-picture/user-profile-picture.component";

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [UserProfilePictureComponent, UserProfilePictureComponent],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.scss'
})
export class DoctorDetailsComponent {
  doctor = input<DoctorSearchResult>();

  onClose = output();
}
