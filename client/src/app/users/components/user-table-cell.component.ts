import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from 'src/app/_models/types';
import { User } from "src/app/_models/users/user";
import { UsersService } from "../users.config";
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { Account } from "src/app/_models/account/account";

@Component({
  host: { class: 'align-middle flex-column-fluid border-none' },
  selector: 'td[userCell]',
  template: `
    <div class="d-flex align-middle">
      <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
        <a [routerLink]="[routerLink]">
          <div class="symbol-label">
            <div userProfilePicture [fullName]="user().fullName" [photoUrl]="user().photoUrl"></div>
          </div>
        </a>
      </div>
      <div class="d-flex flex-column align-middle justify-content-center">
        <a
          [routerLink]="[routerLink]"
          class="text-gray-800 text-hover-primary mb-1"
        >{{ user().fullName }}</a
        >
        <span>{{ user().email }}</span>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ RouterModule, ProfilePictureComponent ],
})
export class UserTableCellComponent<T extends User> implements OnInit {
  service = inject(UsersService);

  user = model.required<T>();
  role = model.required<Role>();

  routerLink?: string;

  account = signal<Account | null>(null);

  constructor() {
    effect(() => {
      const { id, firstName, photoUrl } = this.user();
      this.account.set(new Account({ id, firstName, photoUrl }));
    })
  }

  ngOnInit(): void {
    // TODO - Implement role-based routing
    this.routerLink = `${this.service.dictionary.catalogRoute}/${this.user().id}`;
  }
}
