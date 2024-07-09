import { LayoutModule } from "@angular/cdk/layout";
import {Component, input} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Account} from "src/app/_models/account";
import {SymbolComponent} from "src/app/_shared/layout.module";

@Component({
  host: { class: 'card-body pt-9 pb-0', },
  selector: 'div[accountCard]',
  template: `
    <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
      <div class="me-7 mb-4">
        <div symbol [account]="account()"></div>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
          <div class="d-flex flex-column">
            <div class="d-flex align-items-center mb-2">
              <a [routerLink]="[]" class="text-gray-900 text-hover-primary fs-2 fw-bold me-1">{{ account().fullName }}</a>
              <a [routerLink]="[]">
                @if(account().isEmailVerified){<i class="ki-duotone ki-verify fs-1 text-primary">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>}
              </a>
              <a [routerLink]="[]" class="btn btn-sm btn-light-success fw-bold ms-2 fs-8 py-1 px-3"
              >Upgrade to Pro</a>
            </div>
            <div class="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
              <a [routerLink]="[]" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                <i class="ki-duotone ki-profile-circle fs-4 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>[Especialidad]</a>
              <a [routerLink]="[]" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                <i class="ki-duotone ki-geolocation fs-4 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>SF, Bay Area</a>
              <a [routerLink]="[]" class="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                <i class="ki-duotone ki-sms fs-4 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>{{ account().email }}</a>
            </div>
          </div>
          <div class="d-flex my-4">
            <a [routerLink]="[]" class="btn btn-sm btn-light me-2" id="kt_user_follow_button">
              <i class="ki-duotone ki-check fs-3 d-none"></i>
              <span class="indicator-label">Seguir</span>
              <span class="indicator-progress">Por favor espere...
                          <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
            </a>
            <a [routerLink]="[]" class="btn btn-sm btn-primary me-2">Agenda una cita</a>
            <div class="me-0">
              <button class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                <i class="ki-solid ki-dots-horizontal fs-2x"></i>
              </button>
              <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-3">
                <div class="menu-item px-3">
                  <div class="menu-content text-muted pb-2 px-3 fs-7 text-uppercase">Pagos</div>
                </div>
                <div class="menu-item px-3">
                  <a [routerLink]="[]" class="menu-link px-3">Crear factura</a>
                </div>
                <div class="menu-item px-3">
                  <a [routerLink]="[]" class="menu-link flex-stack px-3">Realizar pago
                    <span class="ms-2" aria-label="Specify a target name for future usage and reference">
                                <i class="ki-duotone ki-information fs-6">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                  <span class="path3"></span>
                                </i>
                              </span></a>
                </div>
                <div class="menu-item px-3">
                  <a [routerLink]="[]" class="menu-link px-3">Hacer nota de venta</a>
                </div>
                <div class="menu-item px-3">
                  <a [routerLink]="[]" class="menu-link px-3">
                    <span class="menu-title">Suscripción</span>
                    <span class="menu-arrow"></span>
                  </a>
                  <div class="menu-sub menu-sub-dropdown w-175px py-4">
                    <div class="menu-item px-3">
                      <a [routerLink]="[]" class="menu-link px-3">Planes</a>
                    </div>
                    <div class="menu-item px-3">
                      <a [routerLink]="[]" class="menu-link px-3">Facturación</a>
                    </div>
                    <div class="menu-item px-3">
                      <a [routerLink]="[]" class="menu-link px-3">Resultados</a>
                    </div>
                    <div class="separator my-2"></div>
                    <div class="menu-item px-3">
                      <div class="menu-content px-3">
                        <label class="form-check form-switch form-check-custom form-check-solid">
                          <input class="form-check-input w-30px h-20px" type="checkbox" value="1" checked="checked" name="notifications">
                          <span class="form-check-label text-muted fs-6">Recuring</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="menu-item px-3 my-1">
                  <a [routerLink]="[]" class="menu-link px-3">Configuración</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-wrap flex-stack">
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
          <div class="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
            <div class="d-flex justify-content-between w-100 mt-auto mb-2">
              <span class="fw-semibold fs-6 text-gray-500">Cuenta configurada</span>
              <span class="fw-bold fs-6">50%</span>
            </div>
            <div class="h-5px mx-3 w-100 bg-light mb-3">
              <div class="bg-success rounded h-5px" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Generales</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/settings']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Configuración</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/security']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Seguridad</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/billing']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Facturación</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/statements']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Resultados</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/referrals']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Recomendaciones</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/api-keys']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">API Keys</a>
      </li>
      <li class="nav-item mt-2">
        <a class="nav-link text-active-primary ms-0 me-10 py-5" [routerLink]="['/account/logs']" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">Logs</a>
      </li>
    </ul>
  `,
  standalone: true,
  imports: [RouterModule, LayoutModule, SymbolComponent, ],
})
export class AccountCardComponent {
  account = input.required<Account>();
}
