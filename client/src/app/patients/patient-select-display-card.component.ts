import { Component, effect, inject, input, model, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Account } from 'src/app/_models/account/account';
import { User } from 'src/app/_models/users/user';
import { IconsService } from 'src/app/_services/icons.service';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';

@Component({
  selector: '[patientSelectDisplayCard]',
  templateUrl: 'patient-select-display-card.component.html',
  imports: [
    RouterLink,
    ProfilePictureComponent
  ],
  standalone: true,
})
export class PatientSelectDisplayCardComponent implements OnInit {
  icons = inject(IconsService);

  title = input<string>();
  item = model.required<User>();
  key = model.required<string>();
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
