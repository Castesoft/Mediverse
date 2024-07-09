import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';

@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'userDropdown'},
  selector: '[userDropdown]',
  template: `
    <div class="cursor-pointer symbol symbol-35px symbol-lg-35px" dropdownToggle tabindex="0">
      <img alt="Pic" src="media/avatars/300-1.jpg">
    </div>
    <div
      class="dropdown-menu dropdown-menu-right menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
      *dropdownMenu>
      <div class="menu-item px-3">
        <div class="menu-content d-flex align-items-center px-3">
          <div class="symbol symbol-50px me-5">
            <img alt="Logo" src="media/avatars/300-1.jpg">
          </div>
          <div class="d-flex flex-column">
            <div class="fw-bold d-flex align-items-center fs-5">Max Smith
              <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">Pro</span>
            </div>
            <a [routerLink]="[]" class="fw-semibold text-muted text-hover-primary fs-7">max&#64;kt.com</a>
          </div>
        </div>
      </div>
      <div class="separator my-2"></div>
      <div class="menu-item px-5">
        <a [routerLink]="['/account/overview']" class="menu-link px-5">My Profile</a>
      </div>
      <div class="menu-item px-5">
        <a [routerLink]="['/apps/projects/list']" class="menu-link px-5">
          <span class="menu-text">Mis proyectos</span>
          <span class="menu-badge">
        <span class="badge badge-light-danger badge-circle fw-bold fs-7">3</span>
      </span>
        </a>
      </div>
      <div class="menu-item px-5">
        <a [routerLink]="[]" class="menu-link px-5">
          <span class="menu-title">Mi subscripción</span>
          <span class="menu-arrow"></span>
        </a>
        <div class="menu-sub menu-sub-dropdown w-175px py-4">
          <div class="menu-item px-3">
            <a [routerLink]="['/account/referrals']" class="menu-link px-5">Referrals</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/billing']" class="menu-link px-5">Facturación</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/statements']" class="menu-link px-5">Pagos</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/statements']" class="menu-link d-flex flex-stack px-5">Statements
              <span class="ms-2 lh-0" data-bs-toggle="tooltip" aria-label="View your statements"
                    data-bs-original-title="View your statements">
            <i class="ki-duotone ki-information-5 fs-5">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </span></a>
          </div>
          <div class="separator my-2"></div>
          <div class="menu-item px-3">
            <div class="menu-content px-3">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input class="form-check-input w-30px h-20px" type="checkbox" value="1" checked="checked"
                       name="notifications">
                <span class="form-check-label text-muted fs-7">Notificaciones</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-item px-5">
        <a [routerLink]="['/account/statements']" class="menu-link px-5">Estados de cuenta</a>
      </div>
      <div class="separator my-2"></div>
      <div class="menu-item px-5">
        <a [routerLink]="[]" class="menu-link px-5">
      <span class="menu-title position-relative">Lenguaje
        <span class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">Inglés
          <img class="w-15px h-15px rounded-1 ms-2" src="media/flags/united-states.svg" alt=""></span></span>
        </a>
        <div class="menu-sub menu-sub-dropdown w-175px py-4">
          <div class="menu-item px-3">
            <a [routerLink]="['/account/settings']" class="menu-link d-flex px-5 active">
          <span class="symbol symbol-20px me-4">
            <img class="rounded-1" src="media/flags/united-states.svg" alt="">
          </span>Inglés</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/settings']" class="menu-link d-flex px-5">
          <span class="symbol symbol-20px me-4">
            <img class="rounded-1" src="media/flags/spain.svg" alt="">
          </span>Español</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/settings']" class="menu-link d-flex px-5">
          <span class="symbol symbol-20px me-4">
            <img class="rounded-1" src="media/flags/germany.svg" alt="">
          </span>Alemán</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/settings']" class="menu-link d-flex px-5">
          <span class="symbol symbol-20px me-4">
            <img class="rounded-1" src="media/flags/japan.svg" alt="">
          </span>Japonés</a>
          </div>
          <div class="menu-item px-3">
            <a [routerLink]="['/account/settings']" class="menu-link d-flex px-5">
          <span class="symbol symbol-20px me-4">
            <img class="rounded-1" src="media/flags/france.svg" alt="">
          </span>Francés</a>
          </div>
        </div>
      </div>
      <div class="menu-item px-5 my-1">
        <a [routerLink]="['/account/settings']" class="menu-link px-5">Configuración de cuenta</a>
      </div>
      <div class="menu-item px-5">
        <a [routerLink]="['/auth/sign-in/basic']" class="menu-link px-5">Cerrar sesión</a>
      </div>
    </div>

  `,
  standalone: true,
  imports: [ BootstrapModule, RouterModule,],
})
export class UserDropdownComponent {

}
