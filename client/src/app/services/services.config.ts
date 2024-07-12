import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ResolveFn, Router, RouterModule, Routes } from "@angular/router";
import { Account } from "src/app/_models/account";
import { CatalogMode, FormUse, Role, Sections, View } from "src/app/_models/types";
import { Service } from "src/app/_models/service";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { GuidService } from "src/app/_services/guid.service";
import { ServicesService } from "src/app/_services/services.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { ServicesCatalogComponent } from "src/app/services/components/services-catalog.component";
import { ServiceDetailComponent, ServiceEditComponent, ServiceNewComponent } from "src/app/services/views";

@Component({
  selector: 'services-route',
  template: `<router-outlet></router-outlet>`,
})
export class ServicesComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}

@Component({
  selector: 'services-catalog-route',
  template: `
  <div card>
    <div
      servicesCatalog
      [mode]="mode"
      [key]="key"
      [view]="view"

    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, ServicesCatalogComponent, LayoutModule,],
})
export class CatalogComponent implements OnInit {
  service = inject(ServicesService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  section: Sections = 'services';
  role: Role = 'Patient';
  label: string;

  constructor() {
    this.label = this.service.naming.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'service-detail-route',
  template: `
    @if (id && item) {
      <div
        serviceDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"

      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, ServiceDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Service;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  section: Sections = 'services';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.name;
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
@Component({
  selector: 'service-edit-route',
  template: `
      @if (id && item) {
        <div
          serviceEditView
          [id]="id"
          [use]="use"
          [view]="view"
          [key]="key"
          [item]="item"

        ></div>
      }
  `,
  standalone: true,
  imports: [ServiceEditComponent, RouterModule, LayoutModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: Service;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
  key = undefined;
  section: Sections = 'services';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.name;
      },
    });
  }
}

@Component({
  selector: 'service-new-route',
  template: `<div serviceNewView [use]="use" [view]="view"
  ></div>`,
  standalone: true,
  imports: [ServiceNewComponent, RouterModule, LayoutModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  role: Role = 'Patient';
}

export const itemResolver: ResolveFn<Service | null> = (route, state) => {
  const service = inject(ServicesService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

export const titleDetailResolver: ResolveFn<string> = (route, state) => {
  const service = inject(ServicesService);
  const id = +route.paramMap.get('id')!;
  service.getById(id).subscribe();
  const item = service.getCurrent();
  if (!item) return 'Detalle de servicio';
  const title = `Detalle de servicio - ${item.name}`;
  return title;
}

export const titleEditResolver: ResolveFn<string> = (route, state) => {
  const service = inject(ServicesService);
  const id = +route.paramMap.get('id')!;
  service.getById(id).subscribe();
  const item = service.getCurrent();
  if (!item) return 'Editar servicio';
  const title = `Editar servicio - ${item.name}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Servicios', data: { breadcrumb: 'Servicios', },
      component: ServicesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de servicios', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nuevo servicio', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/edit', title: titleEditResolver, data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: itemResolver },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }

@NgModule({
  declarations: [
    ServicesComponent,
  ],
  imports: [ CommonModule, ServicesRoutingModule, LayoutModule, ]
})
export class ServicesModule { }
