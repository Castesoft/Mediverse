import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, Injectable, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router, RouterModule, Routes } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Entity, EntityParams, Form, IParams, SelectItem } from 'src/app/_forms/form';
import { Addresses, CatalogMode, FormUse, NamingSubject, Sections, View } from 'src/app/_models/types';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { EnvService } from 'src/app/_services/env.service';
import { ServiceHelper } from 'src/app/_services/serviceHelper';
// import { BreadcrumbsModule } from 'src/app/_utils/breadcrumbs.module';
import { AddressesCatalogComponent } from 'src/app/addresses/components/addresses-catalog.component';
import { AddressDetailModalComponent, AddressesFilterModalComponent, AddressesCatalogModalComponent } from 'src/app/addresses/modals';
import { AddressDetailComponent } from 'src/app/addresses/views';


export class AddressForm extends Form<Address> {}
export class AddressesFilterForm<U extends EntityParams<U>> extends Form<U> {}

export class Address extends Entity {
  street: string = '';
  exteriorNumber: string = '';
  interiorNumber: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  zipcode: string = '';
  photoUrl: string = '';
  latitude: number = 0;
  longitude: number = 0;
  type: Addresses = 'Clinic';

  nursesCount = 0;
  isMain = false;

  constructor() {
    super();
  }
}

export class AddressParams extends EntityParams<Address> implements IParams {
  street: string = '';
  exteriorNumber: string = '';
  interiorNumber: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  zipcode: string = '';
  photoUrl: string = '';
  latitude: number = 0;
  longitude: number = 0;
  type: Addresses = 'Clinic';

  constructor(key: string) {
    super(key);
  }

  get httpParams(): HttpParams {
    let params = super.getHttpParams();

    const existingKeys = params.keys();

    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        if (existingKeys.includes(key)) {
          continue;
        }

        const value = (this as Record<string, any>)[key];

        if (Array.isArray(value)) {
          const joinedValues = this.isSelectItemArray(value)
            ? value.map((item: SelectItem) => item.value).join(',')
            : (value as string[]).join(',');
          if (joinedValues) params = params.append(key, joinedValues);
        } else if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      }
    }

    return params;
  }

  private isSelectItemArray(array: any[]): array is SelectItem[] {
    return array.length > 0 && typeof array[0] === 'object' && 'value' in array[0];
  }
}

@Injectable({
  providedIn: 'root',
})
export class AddressesService extends ServiceHelper<
  Address,
  AddressParams,
  AddressesFilterForm<AddressParams>,
  Addresses
> {
  constructor() {
    super(AddressParams, 'addresses', {
      Account: new NamingSubject('dirección', 'direcciones', 'Direcciones', 'femenine', ''),
      Clinic: new NamingSubject('clínica', 'clínicas', 'Clínicas', 'femenine', ''),
    }, {
      Account: [
        { name: 'name', label: 'Dirección' },
        { name: 'street', label: 'Calle' },
        { name: 'exteriorNumber', label: 'Número exterior' },
        { name: 'interiorNumber', label: 'Número interior' },
        { name: 'neighborhood', label: 'Colonia' },
        { name: 'city', label: 'Ciudad' },
        { name: 'state', label: 'Estado' },
        { name: 'country', label: 'País' },
        { name: 'zipcode', label: 'Código postal' },
        { name: 'photoUrl', label: 'URL de la foto' },
        { name: 'latitude', label: 'Latitud' },
        { name: 'longitude', label: 'Longitud' },
        { name: 'type', label: 'Tipo' },
        { name: 'nursesCount', label: 'Número de enfermeras' },
        { name: 'isMain', label: 'Principal' },
      ],
      Clinic: [
        { name: 'name', label: 'Clínica' },
        { name: 'street', label: 'Calle' },
        { name: 'exteriorNumber', label: 'Número exterior' },
        { name: 'interiorNumber', label: 'Número interior' },
        { name: 'neighborhood', label: 'Colonia' },
        { name: 'zipcode', label: 'Código postal' },
        { name: 'city', label: 'Ciudad' },
        { name: 'state', label: 'Estado' },
        { name: 'country', label: 'País' },
        { name: 'nursesCount', label: 'Número de enfermeras' },
        { name: 'isMain', label: 'Principal' },
      ],
    },
  );
  }

  private detailModalRef: BsModalRef<AddressDetailModalComponent> = new BsModalRef<AddressDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private filterModalRef: BsModalRef<AddressesFilterModalComponent> = new BsModalRef<AddressesFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<AddressesCatalogModalComponent> = new BsModalRef<AddressesCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, view: View): void => {
    this.catalogModalRef = this.bsModalService.show(AddressesCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key, view: view } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(AddressesFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (item: Address | undefined = undefined, key: string | undefined = undefined,
    use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.detailModalRef = this.bsModalService.show(AddressDetailModalComponent, {
      class: "modal-dialog-centered modal-lg",
      initialState: { item: item, use: use, key: key, title: undefined, view: "modal" }} as ModalOptions<AddressDetailModalComponent>);
  } else {
    this.bsModalService.hide();
    switch (use) {
      case "create":
        this.router.navigate([this.dictionary['Clinic'].createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary['Clinic'].catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary['Clinic'].catalogRoute}/${item?.id}`]);
        break;
      }
    }
  };
}


@Component({
  selector: 'addresses-route',
  template: `
  <router-outlet></router-outlet>
  `,
})
export class AddressesComponent {
  dev = inject(EnvService);
}

@Component({
  selector: 'addresses-catalog-route',
  template: `
  <!-- <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'maintenance'"></li>
      <li active [label]="label"></li>
    </nav> -->
  <div
    addressesCatalog
    [mode]="mode"
    [key]="key"
    [view]="view"
    [isCompact]="isCompact"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, AddressesCatalogComponent, ],
})
export class CatalogComponent implements OnInit {
  service = inject(AddressesService);
  compact = inject(CompactTableService);
  router = inject(Router);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.router.url;
  section: Sections = 'addresses';
  label = this.service.dictionary['Clinic'].pluralTitlecase;

  constructor() {
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'address-detail-route',
  template: `
  <!-- <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'maintenance'"></li>
      <li item [section]="'addresses'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav> -->

    @if (id && item) {
      <div addressDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, AddressDetailComponent,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Address;
  id: number = 0;
  use: FormUse = 'detail';
  view: View = 'page';
  label: string = '';
  key = createId();

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.id.toString();
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
@Component({
  selector: 'address-edit-route',
  template: `
  <!-- <nav breadcrumbs>
    <li item [section]="'admin'"></li>
      <li item [section]="'maintenance'"></li>
      <li item [section]="'addresses'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav> -->
      @if (id && item) {
        <div addressDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
      }
  `,
  standalone: true,
  imports: [AddressDetailComponent, RouterModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: Address;
  id: number = 0;
  use: FormUse = 'edit';
  view: View = 'page';
  label: string = '';
  key = createId();

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.id.toString();
      },
    });
  }
}

@Component({
  selector: 'address-new-route',
  template: `
  <!-- <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'maintenance'"></li>
      <li item [section]="'addresses'"></li>
      <li active [label]="'Crear'"></li>
    </nav> -->

  <div addressDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>`
  ,
  standalone: true,
  imports: [AddressDetailComponent, RouterModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  item = undefined;
  key = createId();
}

export const itemResolver: ResolveFn<Address | null> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Células', data: { breadcrumb: 'Células', },
      component: AddressesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de células', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nuevo célula', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/editar', data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: itemResolver },
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
  imports: [ CommonModule, AddressesRoutingModule, ]
})
export class AddressesModule { }
