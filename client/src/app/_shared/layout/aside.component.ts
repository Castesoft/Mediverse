import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  host: { class: 'aside aside-default aside-hoverable', },
  selector: 'div[aside]',
  template: `
    <div style="position: fixed">
      <div class="aside-logo flex-column-auto px-10 pt-9 pb-5">
        <a [routerLink]="['/']">
          <img
            alt="Logo"
            src="media/logos/logo-default.svg"
            class="max-h-50px logo-default theme-light-show"
          />
          <img
            alt="Logo"
            src="media/logos/logo-default-dark.svg"
            class="max-h-50px logo-default theme-dark-show"
          />
          <img
            alt="Logo"
            src="media/logos/logo-minimize.svg"
            class="max-h-50px logo-minimize"
          />
        </a>
      </div>
      <div class="aside-menu flex-column-fluid ps-3 pe-1">
        <div
          class="menu menu-sub-indention menu-column menu-rounded menu-title-gray-600 menu-icon-gray-500 menu-active-bg menu-state-primary menu-arrow-gray-500 fw-semibold fs-6 my-5 mt-lg-2 mb-lg-0"
          id="kt_aside_menu"
        >
          <div
            class="hover-scroll-y mx-4"
            id="kt_aside_menu_wrapper"
          >
            <div
              class="menu-item"
              [routerLink]="['/dashboards']"
              routerLinkActive="active"
            >
              <a class="menu-link" [routerLink]="['/dashboards']">
            <span class="menu-icon">
              <i class="ki-duotone ki-home nav-icon fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
                <span class="menu-title">Inicio</span>
              </a>
            </div>
            <div class="menu-item pt-5">
              <div class="menu-content">
            <span class="fw-bold text-muted text-uppercase fs-7"
            >Gestión Clinica</span
            >
              </div>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="['/home/events']" [routerLinkActive]="'active'" [ariaCurrentWhenActive]="'page'">
            <span class="menu-icon">
              <i class="ki-duotone ki-calendar fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
                <span class="menu-title">
              Citas
            </span>
              </a>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="['/home/patients']" [routerLinkActive]="'active'" [ariaCurrentWhenActive]="'page'">
            <span class="menu-icon">
              <i class="ki-duotone ki-profile-user">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </span>
                <span class="menu-title">Pacientes</span>
              </a>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="[]">
            <span class="menu-icon">
              <i class="ki-duotone ki-user-square fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </span>
                <span class="menu-title">Staff</span>
              </a>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="[]">
            <span class="menu-icon">
              <i class="ki-duotone ki-graph-up">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
              </i>
            </span>
                <span class="menu-title">Analítica</span>
              </a>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="['/dashboards/medicines']">
            <span class="menu-icon">
              <i class="ki-duotone ki-capsule">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
                <span class="menu-title">Inventario</span>
              </a>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="['/dashboards/prescriptions']">
            <span class="menu-icon">
              <i class="ki-duotone ki-book">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </span>
                <span class="menu-title">Recetas</span>
              </a>
            </div>
          </div>
          <div class="menu-item pt-5">
            <div class="menu-content">
              <span class="fw-bold text-muted text-uppercase fs-7">Finanzas</span>
            </div>
          </div>
          <div class="menu-item">
            <a class="menu-link" [routerLink]="['/dashboards/payments']">
          <span class="menu-icon">
            <i class="ki-duotone ki-bill">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
              <span class="path5"></span>
              <span class="path6"></span>
            </i>
          </span>
              <span class="menu-title">Pagos</span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" target="_blank">
          <span class="menu-icon">
            <i class="ki-duotone ki-financial-schedule">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
            </i>
          </span>
              <span class="menu-title">Facturación</span>
            </a>
          </div>
          <div class="menu-item">
            <div class="menu-content">
              <div class="separator mx-1 my-4"></div>
            </div>
          </div>
          <div class="menu-item">
            <a class="menu-link" [routerLink]="['/dashboards/account']">
          <span class="menu-icon">
            <i class="ki-duotone ki-user">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
              <span class="menu-title">Mi Cuenta</span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" [routerLink]="[]">
          <span class="menu-icon">
            <i class="ki-duotone ki-setting-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
              <span class="menu-title">Configuración</span>
            </a>
          </div>
          <div class="menu-item">
            <a class="menu-link" [routerLink]="[]">
          <span class="menu-icon">
            <i class="ki-duotone ki-question-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </span>
              <span class="menu-title">Soporte</span>
            </a>
          </div>
        </div>
      </div>
      <div class="aside-footer flex-column-auto pb-5 d-none" id="kt_aside_footer">
        <a [routerLink]="['/']" class="btn btn-light-primary w-100">Button</a>
      </div>
    </div>

  `,
  standalone: true,
  imports: [ RouterModule, ],
})
export class AsideComponent {}
