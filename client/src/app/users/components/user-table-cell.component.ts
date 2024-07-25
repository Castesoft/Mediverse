import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from 'src/app/_models/types';
import { User } from 'src/app/_models/user';
import { UsersService } from 'src/app/_services/users.service';

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
      [ngClass]="{ 'badge-light-primary': user().sex === 'Masculino', 'badge-light-warning': user().sex === 'Femenino'}">
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
          @if (user().photoUrl) {
          <img [src]="user().photoUrl" alt="Emma Smith" class="w-100" />
          } @else {
          <div [class]="'symbol-label fs-3 bg-light-' + bootstrapClass + ' text-' + bootstrapClass">
            {{ user().firstName[0] }}
          </div>
          }
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
  imports: [RouterModule],
})
export class UserTableCellComponent implements OnInit {
  service = inject(UsersService);

  user = input.required<User>();
  role = input.required<Role>();
  bootstrapClass = 'success';

  routerLink?: string;

  ngOnInit(): void {
    this.routerLink = `${
      this.service.namingDictionary.get(this.role())!.catalogRoute
    }/${this.user().id}`;

    this.bootstrapClass = this.getBootstrapClass(this.user().firstName);
  }

  bootstrapClasses = [
    'success',
    'danger',
    'info',
    'primary',
    // 'secondary',
    'warning',
    'light',
    'dark'
  ];
  
  getBootstrapClass(name: string) {
    const asciiSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const classIndex = asciiSum % this.bootstrapClasses.length;

    return this.bootstrapClasses[classIndex];
  }
  
}
