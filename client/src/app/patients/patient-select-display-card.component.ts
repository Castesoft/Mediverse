import { Component, effect, inject, input, model, OnInit, signal } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink } from "@angular/router";
import { User } from "../_models/user";
import { IconsService } from "../_services/icons.service";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { UserProfilePictureComponent } from '../users/components/user-profile-picture/user-profile-picture.component';
import { Account } from "src/app/_models/account";

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
  item = model.required<User>();
  key = input.required<string>();
  inline = input<boolean>(false);

  account = signal<Account | null>(null);

  constructor() {
    effect(() => {
      this.account.set(new Account({
        id: this.item().id,
        firstName: this.item().firstName,
        photoUrl: this.item().photoUrl,
      }));
    })
  }

  ngOnInit(): void {}

  protected readonly faEye = faEye;
}
