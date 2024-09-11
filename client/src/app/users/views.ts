import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, HostBinding, inject, input, OnInit, viewChild } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormUse, Role, View } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { UserFormComponent } from "src/app/users/components/user-form.component";
import { UserProfilePictureComponent } from "./components/user-profile-picture/user-profile-picture.component";
import { PaymentsTableComponent } from '../_shared/components/payments-table/payments-table.component';
import { EventsTableComponent } from '../events/components/events-table/events-table.component';

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
    <div class="row">
        <div class="col-3">
          <div class="card mb-5 mb-xl-8">
            <div class="card-body pt-15">
              <div class="d-flex flex-center flex-column mb-5">
                <div class="symbol symbol-100px symbol-circle mb-7">
                  <app-user-profile-picture 
                    [firstName]="user.firstName"
                    [photoUrl]="user.photoUrl ?? ''"
                    size="lg"
                  ></app-user-profile-picture>
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
              <div class="separator separator-dashed my-3"></div>
              <div id="kt_customer_view_details" class="collapse show">
                <div class="py-5 fs-6">
                  <div class="badge badge-light-info d-inline">Premium user</div>
                  <div class="fw-bold mt-5">Correo</div>
                  <div class="text-gray-600">
                    <a href="#" class="text-gray-600 text-hover-primary">{{ user.email }}</a>
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
        <div class="col-9">
          <div class="card mb-xl-8">
            <div class="card-header card-header-stretch border-bottom border-gray-200">
              <h3 class="card-title">
                <span class="card-label fw-bolder text-gray-900 fs-2">Detalles</span>
              </h3>
              <div class="card-toolbar m-0">
                <ul
                class="nav nav-stretch nav-line-tabs border-transparent"
                role="tablist"
                >
                <li class="nav-item" role="presentation">
                    <a class="nav-link fs-5 fw-semibold me-3" style="cursor: pointer;" [class.active]="activeTab === 'events'" (click)="onSelectTab('events')">Citas</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link fs-5 fw-semibold" style="cursor: pointer;" [class.active]="activeTab === 'payments'" (click)="onSelectTab('payments')">Pagos</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link fs-5 fw-semibold me-3" style="cursor: pointer;" [class.active]="activeTab === 'clinical-history'" (click)="onSelectTab('clinical-history')">Expediente clínico</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link fs-5 fw-semibold" style="cursor: pointer;" [class.active]="activeTab === 'insurances'" (click)="onSelectTab('insurances')">Seguros</a>
                </li>
                </ul>
              </div>
            </div>
            <div class="separator mb-3 opacity-75"></div>
            <div class="card-body">
              @if (activeTab === 'events') {
                @if (user.doctorEvents && user.doctorEvents!.length > 0) {
                  <div tableWrapper>
                    <table
                      eventsTable
                      [data]="user.doctorEvents"
                      [mode]="'view'"
                      [key]="'event-recipe'"
                    ></table>
                  </div>
                } @else {
                  <div class="text-center py-5">
                    <i class="fas fa-prescription fa-3x text-muted mb-3"></i>
                    <p class="fs-5 text-muted">Aún no existen citas para este paciente.</p>
                  </div>
                }
              } @else if (activeTab === 'clinical-history') {
                @if (user.hasPatientInformationAccess) {

                } @else {
                  <div class="text-center py-5">
                    <i class="ki-duotone ki-lock-2 fs-3x text-muted mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                    <p class="fs-5 text-muted">No tienes acceso a la información de este paciente.</p>
                  </div>
                } 
              } @else if (activeTab === 'payments') {
                <app-payments-table [title]="'Pagos'" [payments]="user.doctorPayments!" [showTabs]="false" [view]="'inline'"></app-payments-table>
              } @else if (activeTab === 'insurances') {
                @if (user.hasPatientInformationAccess) {
                  @if (user.medicalInsuranceCompanies && user.medicalInsuranceCompanies.length > 0) {
                    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                      @for (insurance of user.medicalInsuranceCompanies; track insurance.id) {
                        <div class="col">
                          <div class="card h-100 insurance-card">
                            <div class="card-body p-4">
                              <div class="d-flex align-items-center mb-3">
                                <img [src]="insurance.photoUrl || 'assets/images/default-avatar.png'" class="rounded-circle h-30px me-2" alt="{{ insurance.name }}">
                                <div>
                                  <h5 class="card-title fs-6 fw-bold mb-0">{{ insurance.name }}</h5>
                                </div>
                              </div>
                              <div class="d-flex align-items-center">
                                <i class="ki-duotone ki-shield-tick fs-2 text-primary me-2">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                </i>
                                <span class="fs-7">Póliza: {{ insurance.policyNumber || 'N/A' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-5">
                      <i class="ki-duotone ki-user-tick fs-3x text-muted mb-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <p class="fs-5 text-muted">No hay seguros registrados.</p>
                    </div>
                  }
                } @else {
                  <div class="text-center py-5">
                    <i class="ki-duotone ki-lock-2 fs-3x text-muted mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                    <p class="fs-5 text-muted">No tienes acceso a la información de este paciente.</p>
                  </div>
                }
              }
            </div>
          </div>
      </div>
    </div>
  }
  `,
  styles: [`
    .insurance-card {
      transition: transform 0.2s;
    }
    .insurance-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `],
  standalone: true,
  imports: [UserFormComponent, RouterModule, DatePipe, DecimalPipe, UserProfilePictureComponent, PaymentsTableComponent, EventsTableComponent],
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
  activeTab = 'events';

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.user = data['item'];
      },
    });
  }

  onSelectTab = (tab: string) => this.activeTab = tab;

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
