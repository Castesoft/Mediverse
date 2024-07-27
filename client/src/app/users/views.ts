import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, HostBinding, inject, input, OnInit, viewChild } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormUse, Role, View } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { UserFormComponent } from "src/app/users/components/user-form.component";
import { UserProfilePictureComponent } from "./components/user-profile-picture/user-profile-picture.component";

@Component({
  selector: 'div[userNewView]',
  template: `
  <div userForm [use]="use()" [id]="null" [view]="view()" [role]="role()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ UserFormComponent, ModalWrapperModule, ],
})
export class UserNewComponent {
  use = input.required<FormUse>();
  view = input.required<View>();
  role = input.required<Role>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }

  formComponent = viewChild.required(UserFormComponent);

  onFillForm = () => this.formComponent().fillForm();
}

@Component({
  selector: 'div[userDetailView]',
  template: `
  @if(user) {
    <div class="d-flex flex-column flex-xl-row">
        <div class="flex-column flex-lg-row-auto w-100 w-xl-350px mb-10">
          <div class="card mb-5 mb-xl-8">
            <div class="card-body pt-15">
              <div class="d-flex flex-center flex-column mb-5">
                <div class="symbol symbol-100px symbol-circle mb-7">
                  <app-user-profile-picture [user]="user" size="lg"></app-user-profile-picture>
                </div>
                <a [routerLink]="['']" class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1">{{user.fullName}}</a>
                <div class="fs-5 fw-semibold text-muted mb-6">Paciente</div>
                <div class="d-flex flex-wrap flex-center">
                  <div class="border border-gray-300 border-dashed rounded py-3 px-3 mb-3">
                    <div class="fs-4 fw-bold text-gray-700">
                      <span class="w-75px">6,900</span>
                      <i class="ki-duotone ki-arrow-up fs-3 text-success">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                    <div class="fw-semibold text-muted">Earnings</div>
                  </div>
                  <div class="border border-gray-300 border-dashed rounded py-3 px-3 mx-4 mb-3">
                    <div class="fs-4 fw-bold text-gray-700">
                      <span class="w-50px">130</span>
                      <i class="ki-duotone ki-arrow-down fs-3 text-danger">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                    <div class="fw-semibold text-muted">Citas</div>
                  </div>
                  <div class="border border-gray-300 border-dashed rounded py-3 px-3 mb-3">
                    <div class="fs-4 fw-bold text-gray-700">
                      <span class="w-50px">500</span>
                      <i class="ki-duotone ki-arrow-up fs-3 text-success">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                    <div class="fw-semibold text-muted">Por pagar</div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-stack fs-4 py-3">
                <div class="fw-bold rotate collapsible" [routerLink]="[]" role="button" aria-expanded="false"
                  aria-controls="kt_customer_view_details">Detalles
                  <span class="ms-2 rotate-180">
														<i class="ki-duotone ki-down fs-3"></i>
													</span></div>
                <span>
														<a [routerLink]="[]" class="btn btn-sm btn-light-primary">Editar</a>
													</span>
              </div>
              <div class="separator separator-dashed my-3"></div>
              <div id="kt_customer_view_details" class="collapse show">
                <div class="py-5 fs-6">
                  <div class="badge badge-light-info d-inline">Premium user</div>
                  <div class="fw-bold mt-5">Correo</div>
                  <div class="text-gray-600">
                    <a href="#" class="text-gray-600 text-hover-primary">{{ user.email }}</a>
                  </div>
                  <div class="fw-bold mt-5">Dirección principal</div>
                  <div class="text-gray-600">{{user.street}} {{user.interiorNumber}} {{user.exteriorNumber}}
                    <br>@if(user.neighborhood){{{user.neighborhood}},} {{user.city}}, {{user.state}}
                    <br>{{user.country}}
                  </div>
                  <div class="fw-bold mt-5">Fecha de nacimiento</div>
                  <div class="text-gray-600">{{user.dateOfBirth | date: "mediumDate": "": "es-MX"}}</div>
                  <div class="fw-bold mt-5">Edad</div>
                  <div class="text-gray-600">{{user.age | number}}</div>
                  @if(user.taxId){<div class="fw-bold mt-5">RFC</div>
                  <div class="text-gray-600">{{user.taxId}}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  }
  `,
  standalone: true,
  imports: [UserFormComponent, RouterModule, DatePipe, DecimalPipe, UserProfilePictureComponent],
})
export class UserDetailComponent implements OnInit {
  accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<User>();
  key = input.required<string | undefined>();
  role = input.required<Role>();

  user?: User;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.user = data['item'];
      },
    });
  }

}

@Component({
  selector: 'div[userEditView]',
  template: `
  <div userForm [use]="use()" [id]="id()" [view]="view()" [role]="role()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ UserFormComponent, ModalWrapperModule, ],
})
export class UserEditComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<User>();
  key = input.required<string | undefined>();
  role = input.required<Role>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }
}
