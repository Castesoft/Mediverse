import { NgClass } from '@angular/common';
import { Component, effect, inject, input, model, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from 'src/app/_models/types';
import { User } from "src/app/_models/users/user";
import { UsersService } from 'src/app/_services/users.service';
import { UserProfilePictureComponent } from './user-profile-picture/user-profile-picture.component';
import { Account } from 'src/app/_models/account';

@Component({
  selector: 'td[userHasAccount]',
  template: `
  @if(user().hasAccount) {
    <div class="badge badge-light-success fw-bold">
      Registrado
    </div>
  }
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class UserTableHasAccountCellComponent {
  user = input.required<User>();
}

@Component({
  selector: 'td[userSex]',
  template: `
    <div class="badge fw-bold"
      [ngClass]="{ 'badge-light-primary': user().sex?.name === 'Masculino', 'badge-light-warning': user().sex?.name === 'Femenino'}">
      {{user().sex}}
    </div>
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class UserTableSexCellComponent {
  user = input.required<User>();
}

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[userCell]',
  template: `
    @if (routerLink) {
    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
      <a [routerLink]="[routerLink]">
        <div class="symbol-label">
          <div userProfilePicture userProfilePicture
          [(account)]="account"
          ></div>
        </div>
      </a>
    </div>
    <div class="d-flex flex-column">
      <a
        [routerLink]="[routerLink]"
        class="text-gray-800 text-hover-primary mb-1"
        >{{ user().fullName }}</a
      >
      <span>{{ user().email }}</span>
    </div>
    }
  `,
  standalone: true,
  imports: [RouterModule, UserProfilePictureComponent],
})
export class UserTableCellComponent implements OnInit {
  service = inject(UsersService);

  user = model.required<User>();
  role = model.required<Role>();

  routerLink?: string;

  account = signal<Account | null>(null);

  constructor() {
    effect(() => {
      this.account.set(new Account({
        id: this.user().id,
        firstName: this.user().firstName,
        photoUrl: this.user().photoUrl,
      }));
    })
  }

  ngOnInit(): void {
    // this.routerLink = `${
    //   this.service.dictionary.get(this.role())!.catalogRoute
    // }/${this.user().id}`;
  }

}
