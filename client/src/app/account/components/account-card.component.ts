import { LayoutModule } from "@angular/cdk/layout";
import {Component, inject, input, OnInit} from "@angular/core";
import {RouterModule} from "@angular/router";
import { Account } from "src/app/_models/account/account";
import { SymbolComponent } from "src/app/_shared/template/components/symbols/symbol.component";
import { UserProfilePictureComponent } from "../../users/components/user-profile-picture/user-profile-picture.component";
import { AccountService } from 'src/app/_services/account.service';

@Component({
  host: { class: '', },
  selector: 'div[accountCard]',
  template: `
    <div class="card">
      <div class="card-body p-0">
        <div class="d-flex flex-column flex-sm-row mb-6">
          @if (accountService.hasRole(['Doctor'])) {
            <div (mouseenter)="hoveringBanner= true" (mouseleave)="hoveringBanner=false">
              @if (photoUrl) {
                <img src="{{photoUrl}}" class="position-absolute rounded h-sm-125px h-150px d-flex flex-row-fluid w-100 object-fit-cover" />
              } @else {
                @if (currentPhotoUrl) {
                  <img src="{{currentPhotoUrl}}" class="position-absolute rounded h-sm-125px h-150px d-flex flex-row-fluid w-100 object-fit-cover" />
                } @else {
                  <img src="media/misc/pattern-1.jpg" class="position-absolute rounded h-sm-125px h-150px d-flex flex-row-fluid w-100 object-fit-cover" />
                }
              }
              @if (hoveringBanner || photoUrl) {
                <!-- <button class="position-absolute btn btn-sm btn-icon btn-bg-light btn-active-color-primary" style="z-index: 1; top: 10px; right: 10px;" (click)=>
                    <i class="ki-solid ki-pencil fs-4"></i>
                </button> -->
                <label class="position-absolute btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-35px h-35px bg-body shadow" style="z-index: 1; top: 10px; right: 10px;">
                  <i class="ki-duotone ki-pencil fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <input type="file" name="banner" accept=".png, .jpg, .jpeg" (change)="onPhotoChange($event)" style="display: none;" />
                  <input type="hidden" name="avatar_remove" />
                </label>
              }
              @if(photoUrl) {
                <label (click)="onSaveBanner()" class="position-absolute btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-60px h-35px bg-body shadow" style="z-index: 1; top: 85px; right: 80px;">
                  Guardar
                </label>
                <label (click)="onCancel()" class="position-absolute btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-60px h-35px bg-body shadow" style="z-index: 1; top: 85px; right: 10px;">
                  Cancelar
                </label>
              }
            </div>
          }
          <div class="me-7 mb-3 pt-9 ps-9 position-relative min-h-lg-200px min-w-lg-200px min-h-175px min-w-175px">
            <div class="symbol border border-3 border-white">
              <div userProfilePicture userProfilePicture
                [(account)]="accountService.current"
                shape="square" size="lg" [showOnline]=true
              ></div>
            </div>
          </div>
          <div class="d-flex flex-column position-absolute ps-20 ms-20 pt-12 top-0">
            <div class="d-flex align-items-center mb-4 ps-sm-17 ps-md-12 ps-lg-20 ps-16 ms-9">
              <a [routerLink]="[]" [class.text-white]="accountService.hasRole(['Doctor'])" class="opacity-75-hover fs-1 fw-bolder me-4 flex-shrink-0">{{ account().fullName }}</a>
              <a [routerLink]="[]">
                @if(account().isEmailVerified){
                  <i class="ki-duotone ki-verify fs-1 text-primary">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                }
              </a>
              @if (accountService.hasRole(['Doctor'])) {
                <a [routerLink]="[]" class="btn btn-sm btn-light-success fw-bold ms-2 fs-8 py-1 px-3"
                >Conviértete en Pro</a>
              }
            </div>
            <div class="flex-wrap fw-semibold fs-6 mb-4 ps-sm-17 ps-md-12 ps-lg-20 ps-16 ms-9">
              @if (accountService.hasRole(['Doctor'])) {
                <a [routerLink]="[]" class="btn btn-flex btn-flush btn-color-white opacity-75-hover me-5 flex-shrink-0">
                  <i class="ki-duotone ki-profile-circle fs-6 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>{{ account().mainSpecialty }}
                </a>
                <a [routerLink]="[]" class="btn btn-flex btn-flush btn-color-white opacity-75-hover me-5 flex-shrink-0">
                  <i class="ki-duotone ki-geolocation fs-4 me-1">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>{{ account().city }}, {{ account().state }}
                </a>
              }
              <a [routerLink]="[]" class="btn btn-flex btn-flush opacity-75-hover flex-shrink-0" [class.btn-color-white]="accountService.hasRole(['Doctor'])">
                <i class="ki-duotone ki-sms fs-4 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>{{ account().email }}
              </a>
            </div>
          </div>
          <div class="d-flex flex-column flex-xl-row align-items-center justify-content-between mt-sm-20 pt-sm-20 w-100 me-9 px-9 px-sm-0">
            @if (accountService.hasRole(['Doctor'])) {
              <div class="d-flex flex-wrap flex-stack pt-6">
                <div class="d-flex flex-column flex-grow-1 pe-8">
                  <div class="d-flex flex-wrap">
                    <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-arrow-up fs-3 text-success me-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div class="fs-2 fw-bold counted">$4,500</div>
                      </div>
                      <div class="fw-semibold fs-6 text-gray-500">Ganancias</div>
                    </div>
                    <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-arrow-down fs-3 text-danger me-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div class="fs-2 fw-bold counted">75</div>
                      </div>
                      <div class="fw-semibold fs-6 text-gray-500">Retención</div>
                    </div>
                    <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-arrow-up fs-3 text-success me-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div class="fs-2 fw-bold counted">%60</div>
                      </div>
                      <div class="fw-semibold fs-6 text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div class="pt-xl-4 flex-shrink-0">
              <a [routerLink]="['/home/search']" class="btn btn-primary my-1">Agenda una cita</a>
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold card-px">
          <li class="nav-item mt-2">
            <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Generales</a>
          </li>
          <li class="nav-item mt-2">
            <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/clinical-history']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Expediente Clínico</a>
          </li>
          <li class="nav-item mt-2">
            <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/settings']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Configuración</a>
          </li>
          <li class="nav-item mt-2">
            <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/billing']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Facturación</a>
          </li>
          <li class="nav-item mt-2">
            <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/payments']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Pagos</a>
          </li>
          <li class="nav-item mt-2">
            <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/insurances']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Seguros</a>
          </li>
          @if (accountService.hasRole(["Doctor"])) {
            <li class="nav-item mt-2">
              <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/schedules']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Horarios</a>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, LayoutModule, SymbolComponent, UserProfilePictureComponent],
})
export class AccountCardComponent implements OnInit {
  accountService = inject(AccountService);

  account = input.required<Account>();

  hoveringBanner = false;
  photoFile: any;
  photoUrl: any;
  currentPhotoUrl: any;

  ngOnInit() {
    this.currentPhotoUrl = this.account().bannerUrl;
  }

  onPhotoChange(event: any) {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(this.photoFile);

      event.target.value = '';
    }
  }

  onSaveBanner() {
    const formData = new FormData();

    formData.append('file', this.photoFile);

    this.accountService.setDoctorBanner(formData).subscribe({
      next: (response) => {
        this.photoUrl = undefined;
        this.photoFile = undefined;
        this.currentPhotoUrl = this.accountService.current()!.bannerUrl;
      },
    });
  }

  onCancel() {
    this.photoUrl = undefined;
    this.photoFile = undefined;
  }
}
