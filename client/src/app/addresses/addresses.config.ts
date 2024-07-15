import { CommonModule } from "@angular/common";
import { Component, inject, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, ResolveFn, Router, RouterModule } from "@angular/router";
import { Account } from "src/app/_models/account";
import { Address } from "src/app/_models/address";
import { Addresses, CatalogMode, FormUse, Sections, View } from "src/app/_models/types";
import { AccountService } from "src/app/_services/account.service";
import { AddressesService } from "src/app/_services/addresses.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { GuidService } from "src/app/_services/guid.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { AddressesCatalogComponent } from "src/app/addresses/components/addresses-catalog.component";
import { AddressDetailComponent, AddressEditComponent, AddressNewComponent } from "src/app/addresses/views";

@Component({
  selector: 'addresses-route',
  template: `<router-outlet></router-outlet>`,
})
export class AddressesComponent implements OnInit {
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
  selector: 'addresses-catalog-route',
  template: `
  <div card>
    <div
      addressesCatalog
      [mode]="mode"
      [key]="key"
      [view]="view"
      [type]="type"
    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, AddressesCatalogComponent, LayoutModule,],
})
class CatalogComponent implements OnInit {
  service = inject(AddressesService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  section: Sections = 'addresses';
  type: Addresses = 'Account';
  label: string;

  constructor() {
    this.label = this.service.namingDictionary.get(this.type)!.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'address-detail-route',
  template: `
    @if (id && item) {
      <div
        addressDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"
        [type]="type"
      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, AddressDetailComponent, LayoutModule,],
})
class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Address;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  section: Sections = 'addresses';
  type: Addresses = 'Account';

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
  selector: 'address-edit-route',
  template: `
      @if (id && item) {
        <div card>
          <div
            addressEditView
            [id]="id"
            [use]="use"
            [view]="view"
            [key]="key"
            [item]="item"
            [type]="type"
          ></div>
        </div>
      }
  `,
  standalone: true,
  imports: [AddressEditComponent, RouterModule, LayoutModule,],
})
class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: Address;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
  key = undefined;
  section: Sections = 'addresses';
  type: Addresses = 'Account';

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
  selector: 'address-new-route',
  template: `<div addressNewView [use]="use" [view]="view" [type]="type"
  ></div>`,
  standalone: true,
  imports: [AddressNewComponent, RouterModule, LayoutModule,],
})
class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  type: Addresses = 'Account';
}

export const addressResolver: ResolveFn<Address | null> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id, 'Account');
};

export const addressTitleDetailResolver: ResolveFn<string> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  service.getById(id, 'Account').subscribe();
  const address = service.getCurrent();
  if (!address) return 'Detalle de dirección';
  const title = `Detalle de dirección - ${address.name}`;
  return title;
}

export const addressTitleEditResolver: ResolveFn<string> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  service.getById(id, 'Account').subscribe();
  const address = service.getCurrent();
  if (!address) return 'Editar dirección';
  const title = `Editar dirección - ${address.name}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Dirección', data: { breadcrumb: 'Dirección', },
      component: AddressesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de direcciones', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nueva dirección', data: { breadcrumb: 'Nueva', }, },
        {
          path: ':id', title: addressTitleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: addressResolver },
        },
        {
          path: ':id/edit', title: addressTitleEditResolver, data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: addressResolver },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class AddressesRoutingModule { }

@NgModule({
  declarations: [
    AddressesComponent,
  ],
  imports: [ CommonModule, AddressesRoutingModule, LayoutModule, ]
})
export class AddressesModule { }

// clinics

@Component({
  selector: 'clinics-route',
  template: `<router-outlet></router-outlet>`,
})
export class ClinicsComponent implements OnInit {
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
  selector: 'clinics-catalog-route',
  template: `
  <div card>
    <div
      addressesCatalog
      [mode]="mode"
      [key]="key"
      [view]="view"
      [type]="type"
    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, AddressesCatalogComponent, LayoutModule,],
})
class ClinicsCatalogComponent implements OnInit {
  service = inject(AddressesService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  section: Sections = 'clinics';
  type: Addresses = 'Clinic';
  label: string;

  constructor() {
    this.label = this.service.namingDictionary.get(this.type)!.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'nurse-detail-route',
  template: `
    @if (id && item) {
      <div
        addressDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"
        [type]="type"
      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, AddressDetailComponent, LayoutModule,],
})
class ClinicDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Address;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  section: Sections = 'clinics';
  type: Addresses = 'Clinic';

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
  selector: 'nurse-edit-route',
  template: `
      @if (id && item) {
        <div
          addressEditView
          [id]="id"
          [use]="use"
          [view]="view"
          [key]="key"
          [item]="item"
          [type]="type"
        ></div>
      }
  `,
  standalone: true,
  imports: [AddressEditComponent, RouterModule, LayoutModule,],
})
class ClinicEditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: Address;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
  key = undefined;
  section: Sections = 'clinics';
  type: Addresses = 'Clinic';

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
  selector: 'nurse-new-route',
  template: `<div addressNewView [use]="use" [view]="view" [type]="type"
  ></div>`,
  standalone: true,
  imports: [AddressNewComponent, RouterModule, LayoutModule,],
})
class ClinicNewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  type: Addresses = 'Clinic';
}

export const clinicResolver: ResolveFn<Address | null> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id, 'Clinic');
};

export const clinicTitleDetailResolver: ResolveFn<string> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  service.getById(id, 'Clinic').subscribe();
  const address = service.getCurrent();
  if (!address) return 'Detalle de clínica';
  const title = `Detalle de clínica - ${address.name}`;
  return title;
}

export const clinicTitleEditResolver: ResolveFn<string> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  service.getById(id, 'Clinic').subscribe();
  const address = service.getCurrent();
  if (!address) return 'Editar clínica';
  const title = `Editar clínica - ${address.name}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Clínicas', data: { breadcrumb: 'Clínicas', },
      component: ClinicsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: ClinicsCatalogComponent, title: 'Catálogo de clínicas', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: ClinicNewComponent, title: 'Crear nuevo clínica', data: { breadcrumb: 'Nueva', }, },
        {
          path: ':id', title: clinicTitleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: ClinicDetailComponent,
          resolve: { item: clinicResolver },
        },
        {
          path: ':id/edit', title: clinicTitleEditResolver, data: { breadcrumb: 'Editar', },
          component: ClinicEditComponent,
          resolve: { item: clinicResolver },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class ClinicsRoutingModule { }

@NgModule({
  declarations: [ ClinicsComponent, ],
  imports: [ CommonModule, ClinicsRoutingModule, LayoutModule, ]
})
export class ClinicsModule { }
