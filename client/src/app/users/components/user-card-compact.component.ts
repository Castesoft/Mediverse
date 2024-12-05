import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, model } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { View } from "src/app/_models/base/types";
import { Role } from "src/app/_models/types";
import { User } from "src/app/_models/users/user";
import { UsersService } from "../users.config";

@Component({
  host: { class: 'card', },
  selector: 'div[userCardCompact]',
  template: `
    <!-- @if (user) {
      <div class="card-body d-flex flex-center flex-column pt-12 p-9">
        <div class="symbol symbol-65px symbol-circle mb-5">
          @if (user.photoUrl) {
            <img [src]="user.photoUrl" [alt]="user.fullName" class="w-100"/>
          } @else {
            <span class="symbol-label fs-2x fw-semibold text-primary bg-light-primary">
                {{ user.firstName[0] }}
            </span>
          }
          <div
            class="bg-success position-absolute border border-4 border-body h-15px w-15px rounded-circle translate-middle start-100 top-100 ms-n3 mt-n3">
            </div>
        </div>
        <a [routerLink]="[]" (click)="service.clickLink(role(), user.id, user, key(), 'detail', view())"
           class="fs-4 text-gray-800 text-hover-primary fw-bold mb-0">
          {{ user.fullName }}
        </a>
        <div class="fw-semibold text-gray-500 mb-6">{{ user.email }}</div>
        <div class="d-flex flex-center flex-wrap">
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 mb-3">
            <div class="fs-6 fw-bold text-gray-700">{{ 200 | currency }}</div>
            <div class="fw-semibold text-gray-500">Por pagar</div>
          </div>
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 mb-3">
            <div class="fs-6 fw-bold text-gray-700">{{ 200 | number }}</div>
            <div class="fw-semibold text-gray-500">Citas</div>
          </div>
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 mb-3">
            <div class="fs-6 fw-bold text-gray-700">{{ 200 | currency }}</div>
            <div class="fw-semibold text-gray-500">Pagado</div>
          </div>
        </div>
      </div>
    } -->
  `,
  standalone: true,
  imports: [CommonModule, RouterModule,],
})
export class UserCardCompactComponent implements OnInit {
  service = inject(UsersService);
  router = inject(Router);

  role = model.required<Role>();
  view = model.required<View>();
  key = model.required<string>();

  user?: User;

  ngOnInit(): void {
    // this.service.selected$(this.key()).subscribe({
    //   next: user => {
    //     console.log(user)
    //     this.user = user;
    //   }
    // })
  }
}
