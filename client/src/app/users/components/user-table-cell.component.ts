import { Component, effect, inject, model, ModelSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from 'src/app/_models/types';
import { User } from "src/app/_models/users/user";
import { UsersService } from "../users.config";
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { Account } from "src/app/_models/account/account";

@Component({
  host: { class: 'align-middle flex-column-fluid border-none' },
  selector: 'td[userCell]',
  templateUrl: './user-table-cell.component.html',
  imports: [ RouterModule, ProfilePictureComponent ],
  standalone: true,
})
export class UserTableCellComponent<T extends User> implements OnInit {
  service: UsersService = inject(UsersService);

  user: ModelSignal<T> = model.required<T>();
  role: ModelSignal<Role> = model.required<Role>();

  routerLink?: string;

  account: WritableSignal<Account | null> = signal<Account | null>(null);

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
