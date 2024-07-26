import { Component, inject, input, OnInit } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink } from "@angular/router";
import { User } from "../_models/user";
import { IconsService } from "../_services/icons.service";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { UserProfilePictureComponent } from '../users/components/user-profile-picture/user-profile-picture.component';

@Component({
  selector: '[patientSelectDisplayCard]',
  templateUrl: 'patient-select-display-card.component.html',
  imports: [
    FaIconComponent,
    RouterLink,
    UserProfilePictureComponent
  ],
  standalone: true,
})
export class PatientSelectDisplayCardComponent implements OnInit {
  icons = inject(IconsService);

  title = input<string>();
  item = input<User>();
  key = input.required<string>();

  ngOnInit(): void {}

  protected readonly faEye = faEye;
}
