import { Component, HostBinding, input, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Account } from "src/app/_models/account";
import { HeaderSearchComponent } from "src/app/_shared/layout/header-search.component";
import { HeaderComponent } from "src/app/_shared/layout/header.component";
import { NotificationsDropdownComponent } from "src/app/_shared/layout/notifications-dropdown.component";
import { QuickLinksDropdownComponent } from "src/app/_shared/layout/quick-links-dropdown.component";
import { ScrolltopComponent } from "src/app/_shared/layout/scrolltop.component";
import { ThemeDropdownComponent } from "src/app/_shared/layout/theme-dropdown.component";
import { UserDropdownComponent } from "src/app/_shared/layout/user-dropdown.component";

// root
@Component({
  host: { class: 'd-flex flex-column flex-root', },
  selector: 'div[root]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class RootComponent { }

// page
@Component({
  host: { class: 'page d-flex flex-row flex-column-fluid', },
  selector: 'div[page]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class PageComponent { }

@Component({
  host: { class: 'position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px', },
  selector: 'div[onlineBadge]',
  template: ``,
  standalone: true,
})
export class OnlineBadgeComponent { }

@Component({
  host: { class: 'symbol-label bg-light-danger text-danger fs-6 fw-bolder', },
  selector: 'span[symbolLabel]',
  template: `{{label()[0]}}`,
  standalone: true,
})
export class SymbolLabelComponent {
  label = input.required<string>();
}

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
              <a class="menu-link" [routerLink]="['/dashboards/appointments']">
            <span class="menu-icon">
              <i class="ki-duotone ki-calendar fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
                <span class="menu-title">
              Citas
              <span
                class="badge badge-changelog badge-light-success bg-hover-danger text-hover-white fw-bold fs-9 px-2 ms-2"
              >
                Nuevas
              </span>
            </span>
              </a>
            </div>
            <div class="menu-item">
              <a class="menu-link" [routerLink]="['/dashboards/patients']">
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


@Component({
  selector: '[footer]',
  host: { class: 'footer py-4 d-flex flex-lg-column', id: 'kt_footer' },
  template: `
    <div class="container-fluid d-flex flex-column flex-md-row flex-stack">
      <div class="text-gray-900 order-2 order-md-1">
        <span class="text-muted fw-semibold me-2">2024©</span>
        <a
          [routerLink]="[]"
          target="_blank"
          class="text-gray-800 text-hover-primary"
          >Mediverse</a
        >
      </div>
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <a [routerLink]="[]" target="_blank" class="menu-link px-2"
            >Nosotros</a
          >
        </li>
        <li class="menu-item">
          <a [routerLink]="[]" target="_blank" class="menu-link px-2">Ayuda</a>
        </li>
        <li class="menu-item">
          <a [routerLink]="[]" target="_blank" class="menu-link px-2"
            >Comprar</a
          >
        </li>
      </ul>
    </div>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class FooterComponent {}

@Component({
  host: { class: 'symbol symbol-100px symbol-lg-160px symbol-fixed position-relative', },
  selector: 'div[symbol]',
  template: `
    @if(account().photoUrl){<img [src]="account().photoUrl" alt="image">}
    @else {<span symbolLabel [label]="account().firstName"></span>}
    <div onlineBadge></div>
  `,
  standalone: true,
  imports: [ SymbolLabelComponent, OnlineBadgeComponent ],
})
export class SymbolComponent {
  account = input.required<Account>();
}

@Component({
  host: { class: 'card mb-5 mb-xl-10', },
  selector: 'div[card]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardComponent { }

// card header
@Component({
  host: { class: 'card-header cursor-pointer', },
  selector: 'div[cardHeader]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardHeaderComponent { }

// card title
@Component({
  host: { class: 'card-title m-0', },
  selector: 'div[cardTitle]',
  template: `{{title()}}`,
  standalone: true,
})
export class CardTitleComponent {
  title = input.required<string>();
}

@Component({
  host: { class: 'card-body p-9', },
  selector: 'div[cardBody]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardBodyComponent { }

@Component({
  host: { class: 'card-footer d-flex justify-content-end py-6 px-9', },
  selector: 'div[cardFooter]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardFooterComponent { }

// wrapper

@Component({
  host: { class: 'wrapper d-flex flex-column flex-row-fluid', },
  selector: 'div[wrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class WrapperComponent { }

// header container

@Component({
  host: { class: 'container-fluid d-flex align-items-stretch justify-content-between', },
  selector: 'div[headerContainer]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class HeaderContainerComponent { }

// header logo bar

@Component({
  host: { class: 'd-flex align-items-center flex-grow-1 flex-lg-grow-0', },
  selector: 'div[headerLogo]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class HeaderLogoComponent { }

// header topbar

@Component({
  host: { class: 'd-flex align-items-stretch justify-content-between flex-lg-grow-1', },
  selector: 'div[headerTopbar]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class HeaderTopbarComponent { }

@Component({
  host: { class: 'content fs-6 d-flex flex-column flex-column-fluid', },
  selector: 'div[content]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ContentComponent { }

@Component({
  host: { class: 'toolbar', },
  selector: 'div[toolbar]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarComponent { }

@Component({
  host: { class: 'container-fluid d-flex flex-stack flex-wrap flex-sm-nowrap', },
  selector: 'div[toolbarContainer]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarContainerComponent { }

@Component({
  host: { class: 'd-flex flex-column align-items-start justify-content-center flex-wrap me-2', },
  selector: 'div[toolbarInfo]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarInfoComponent { }

@Component({
  host: { class: 'text-gray-900 fw-bold my-1 fs-2', },
  selector: 'h1[toolbarTitle]',
  template: `{{title()}}`,
  standalone: true,
})
export class ToolbarTitleComponent {
  title = input.required<string>();
}

@Component({
  host: { class: 'breadcrumb fw-semibold fs-base my-1', },
  selector: 'ul[breadcrumb]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class BreadcrumbComponent { }

@Component({
  selector: 'li[breadcrumbLink]',
  template: `
  @if(!active() && url() && label()) {
    <a class="text-muted text-hover-primary" [routerLink]="[url()]">{{label()}}</a>
  } @else { {{label()}} }
  `,
  standalone: true,
  imports: [ RouterModule, ]
})
export class BreadcrumbLinkComponent {
  label = input.required<string>();
  url = input<string | undefined>(undefined);
  active = input<boolean>(false);

  @HostBinding('class') get hostClasses() {
    return this.active() ? 'breadcrumb-item text-gray-900' : 'breadcrumb-item text-muted';
  }
}

@Component({
  host: { class: 'd-flex align-items-center flex-nowrap text-nowrap py-1', },
  selector: 'div[toolbarActions]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarActionsComponent {}

@Component({
  host: { class: 'post fs-6 d-flex flex-column-fluid', },
  selector: 'div[post]',
  template: `
  <div class="container-xxl">
    <ng-content></ng-content>
  </div>
  `,
  standalone: true,
  imports: [],
})
export class PostComponent {}

@NgModule({
  imports: [
    ContentComponent,
    ToolbarComponent,
    ToolbarContainerComponent,
    ToolbarInfoComponent,
    ToolbarTitleComponent,
    BreadcrumbComponent,
    BreadcrumbLinkComponent,
    ToolbarActionsComponent,
    PostComponent,
    OnlineBadgeComponent,
    SymbolLabelComponent,
    SymbolComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardBodyComponent,
    CardFooterComponent,
    WrapperComponent,
    HeaderContainerComponent,
    HeaderLogoComponent,
    HeaderTopbarComponent,
    RootComponent,
    PageComponent,
    FooterComponent,
    AsideComponent,
    HeaderSearchComponent,
    HeaderComponent,
    NotificationsDropdownComponent,
    QuickLinksDropdownComponent,
    ScrolltopComponent,
    ThemeDropdownComponent,
    UserDropdownComponent,
  ],
  exports: [
    ContentComponent,
    ToolbarComponent,
    ToolbarContainerComponent,
    ToolbarInfoComponent,
    ToolbarTitleComponent,
    BreadcrumbComponent,
    BreadcrumbLinkComponent,
    ToolbarActionsComponent,
    PostComponent,
    OnlineBadgeComponent,
    SymbolLabelComponent,
    SymbolComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardBodyComponent,
    CardFooterComponent,
    WrapperComponent,
    HeaderContainerComponent,
    HeaderLogoComponent,
    HeaderTopbarComponent,
    RootComponent,
    PageComponent,
    FooterComponent,
    AsideComponent,
    HeaderSearchComponent,
    HeaderComponent,
    NotificationsDropdownComponent,
    QuickLinksDropdownComponent,
    ScrolltopComponent,
    ThemeDropdownComponent,
    UserDropdownComponent,
  ],
})
export class LayoutModule { }
