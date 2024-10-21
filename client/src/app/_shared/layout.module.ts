import {Component, HostBinding, inject, input, model, NgModule, OnInit} from "@angular/core";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import { Account } from "src/app/_models/account";
import {NamingSubject} from "src/app/_models/types";
import { AsideComponent } from "src/app/_shared/layout/aside.component";
import { HeaderSearchComponent } from "src/app/_shared/layout/header-search.component";
import { HeaderComponent } from "src/app/_shared/layout/header.component";
import { NotificationsDropdownComponent } from "src/app/_shared/layout/notifications-dropdown.component";
import { QuickLinksDropdownComponent } from "src/app/_shared/layout/quick-links-dropdown.component";
import { ScrolltopComponent } from "src/app/_shared/layout/scrolltop.component";
import { ThemeDropdownComponent } from "src/app/_shared/layout/theme-dropdown.component";
import { UserDropdownComponent } from "src/app/_shared/layout/user-dropdown.component";
import { UtilsService } from '../_services/utils.service';

// root
@Component({
  host: { class: 'd-flex flex-column flex-root h-100', },
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
  host: { class: 'position-absolute bg-success rounded-circle border border-4 border-body h-20px w-20px', style: 'bottom: -5px; right: -5px;', },
  selector: 'div[onlineBadge]',
  template: ``,
  standalone: true,
})
export class OnlineBadgeComponent { }

@Component({
  host: { class: 'symbol-label bg-light-danger text-danger fs-1 fw-bolder', },
  selector: 'span[symbolLabel]',
  template: `{{label()[0]}}`,
  standalone: true,
})
export class SymbolLabelComponent {
  label = input.required<string>();
}

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
    @else if(account().firstName) {<span symbolLabel [label]="account().firstName!"></span>}
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

// catalog card header
@Component({
  host: { class: 'card-header border-0 pt-6', },
  selector: 'div[catalogCardHeader]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CatalogCardHeaderComponent { }

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
  host: { class: 'wrapper d-flex flex-column flex-row-fluid' },
  selector: 'div[wrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class WrapperComponent {
  utilsService = inject(UtilsService);

  @HostBinding('style') get paddingStyle() {
    return this.utilsService.sidebarCollapsed() ? 'padding-left: 40px;' : '';
  }
}

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
  host: { class: 'toolbar', id: 'kt_toolbar', },
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
export class ToolbarTitleComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  title = model<string>();

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event: any) => {
        if (this.title() !== this.route.snapshot.title) {
          this.title.set(this.route.snapshot.title);
        }
      }
    })
  }
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

@Component({
  host: {class: 'btn btn-light-primary me-3', type: 'button',},
  selector: 'button[filterMenuBtn]',
  template: `
    <i class="ki-duotone ki-filter fs-2">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>Filtros
  `,
  standalone: true,
  imports: [],
})
export class FilterMenuBtnComponent {}

@Component({
  host: { class: 'btn btn-light-primary me-3', type: 'button',},
  selector: 'button[exportBtn]',
  template: `
    <i class="ki-duotone ki-exit-up fs-2">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>Exportar
  `,
  standalone: true,
  imports: [],
})
export class ExportBtnComponent {}

@Component({
  host: { class: 'btn btn-primary', type: 'button',},
  selector: 'button[createBtn]',
  template: `<i class="ki-duotone ki-plus fs-2"></i>Agregar {{naming().singular}}`,
  standalone: true,
  imports: [],
})
export class CreateBtnComponent {
  naming = input.required<NamingSubject>();
}

@Component({
  host: { class: 'd-flex justify-content-end align-items-center', },
  selector: 'div[deleteSelectedBtn]',
  template: `
    <div class="fw-bold me-5">
      <span class="me-2">{{count()}}</span>Seleccionados
    </div>
    <button type="button" class="btn btn-danger">Eliminar seleccionados</button>
  `,
  standalone: true,
  imports: [],
})
export class DeleteSelectedBtnComponent {
  count = input.required<number>();
}

@Component({
  host: { class: 'form fv-plugins-bootstrap5 fv-plugins-framework', },
  selector: 'div[formWrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class FormWrapperComponent {}

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
    CatalogCardHeaderComponent,
    FilterMenuBtnComponent,
    ExportBtnComponent,
    CreateBtnComponent,
    DeleteSelectedBtnComponent,
    FormWrapperComponent,
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
    CatalogCardHeaderComponent,
    FilterMenuBtnComponent,
    ExportBtnComponent,
    CreateBtnComponent,
    DeleteSelectedBtnComponent,
    FormWrapperComponent,
  ],
})
export class LayoutModule { }
