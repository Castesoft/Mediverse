import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, Injectable, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router, RouterModule } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { SelectOption } from 'src/app/_forms/form';
import { Columns, FormGroup2 } from 'src/app/_forms/form2';
import { Address, Addresses } from 'src/app/_models/address';
import { CatalogMode, EntityParams, FormUse, IParams, NamingSubject, Sections, View } from 'src/app/_models/types';
import { EnvService } from 'src/app/_services/env.service';
import { ServiceHelper } from 'src/app/_services/serviceHelper';
// import { BreadcrumbsModule } from 'src/app/_utils/breadcrumbs.module';
import { AddressesCatalogComponent } from 'src/app/addresses/components/addresses-catalog.component';
import { AddressDetailModalComponent, AddressesFilterModalComponent, AddressesCatalogModalComponent } from 'src/app/addresses/modals';
import { AddressDetailComponent } from 'src/app/addresses/views';


export const sortOptions = Object.values({
  city: new SelectOption({ id: 1, name: 'Ciudad', code: 'city' }),
  country: new SelectOption({ id: 2, name: 'País', code: 'country' }),
  createdAt: new SelectOption({ id: 3, name: 'Creado', code: 'createdAt' }),
  description: new SelectOption({ id: 4, name: 'Descripción', code: 'description' }),
  enabled: new SelectOption({ id: 5, name: 'Habilitado', code: 'enabled' }),
  exteriorNumber: new SelectOption({ id: 6, name: 'Número exterior', code: 'exteriorNumber' }),
  id: new SelectOption({ id: 7, name: 'ID', code: 'id' }),
  interiorNumber: new SelectOption({ id: 8, name: 'Número interior', code: 'interiorNumber' }),
  isMain: new SelectOption({ id: 9, name: 'Principal', code: 'isMain' }),
  isSelected: new SelectOption({ id: 10, name: 'Seleccionado', code: 'isSelected' }),
  latitude: new SelectOption({ id: 11, name: 'Latitud', code: 'latitude' }),
  longitude: new SelectOption({ id: 12, name: 'Longitud', code: 'longitude' }),
  name: new SelectOption({ id: 13, name: 'Nombre', code: 'name' }),
  neighborhood: new SelectOption({ id: 14, name: 'Colonia', code: 'neighborhood' }),
  nursesCount: new SelectOption({ id: 15, name: 'Número de enfermeras', code: 'nursesCount' }),
  photoUrl: new SelectOption({ id: 16, name: 'URL de la foto', code: 'photoUrl' }),
  state: new SelectOption({ id: 17, name: 'Estado', code: 'state' }),
  street: new SelectOption({ id: 18, name: 'Calle', code: 'street' }),
  type: new SelectOption({ id: 19, name: 'Tipo', code: 'type' }),
  visible: new SelectOption({ id: 20, name: 'Visible', code: 'visible' }),
  zipcode: new SelectOption({ id: 21, name: 'Código postal', code: 'zipcode' }),
} as Columns<Address>);

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
            ? value.map((item: SelectOption) => item.name).join(',')
            : (value as string[]).join(',');
          if (joinedValues) params = params.append(key, joinedValues);
        } else if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      }
    }

    return params;
  }

  private isSelectItemArray(array: any[]): array is SelectOption[] {
    return array.length > 0 && typeof array[0] === 'object' && 'value' in array[0];
  }
}

@Injectable({
  providedIn: 'root',
})
export class AddressesService extends ServiceHelper<Address, AddressParams, FormGroup2<AddressParams>> {
  constructor() {
    super(AddressParams, 'addresses', new NamingSubject(
      'feminine',
      'dirección',
      'direcciones',
      'Dirección',
      'addresses',
      ['home', 'clinics']
    ),
[
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
  ]
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
        this.router.navigate([this.dictionary.createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}`]);
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
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, AddressesCatalogComponent, ],
})
export class CatalogComponent {
  service = inject(AddressesService);
  router = inject(Router);

  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.router.url;
  section: Sections = 'addresses';
  // label = this.service.dictionary['Clinic'].pluralTitlecase;

  constructor() {
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
        // if (this.item) this.label = this.item.id.toString();
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
        // if (this.item) this.label = this.item.id.toString();
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
  item = null;
  key = createId();
}

export const itemResolver: ResolveFn<Address | null> = (route, state) => {
  const service = inject(AddressesService);
  const id = +route.paramMap.get('id')!;
  // return service.getById(id);
  return {} as any;
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Células', data: { breadcrumb: 'Células', },
      component: AddressesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de células', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nuevo célula', data: { breadcrumb: 'Nuevo', }, },
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
