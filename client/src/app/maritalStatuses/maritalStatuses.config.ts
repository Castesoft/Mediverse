import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, Injectable, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router, RouterModule } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { SelectOption } from 'src/app/_forms/form';
import { FormGroup2 } from 'src/app/_forms/form2';
import { CatalogMode, Column, Entity, EntityParams, FormUse, IParams, NamingSubject, Sections, View } from 'src/app/_models/types';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { EnvService } from 'src/app/_services/env.service';
import { ServiceHelper } from 'src/app/_services/serviceHelper';
import { BreadcrumbsModule } from 'src/app/_utils/breadcrumbs.module';
import { buildHttpParams, omitKeys } from 'src/app/_utils/util';
import { MaritalStatusesCatalogComponent } from 'src/app/maritalStatuses/components/maritalStatuses-catalog.component';
import { MaritalStatusDetailModalComponent, MaritalStatusesFilterModalComponent, MaritalStatusesCatalogModalComponent } from 'src/app/maritalStatuses/modals';
import { MaritalStatusDetailComponent } from 'src/app/maritalStatuses/views';


export const sortOptions = Object.values({
  code: new SelectOption({ id: 1, code: 'code', name: 'Código' }),
  name: new SelectOption({ id: 2, code: 'name', name: 'Nombre' }),
  description: new SelectOption({ id: 3, code: 'description', name: 'Descripción' }),
  createdAt: new SelectOption({ id: 4, code: 'createdAt', name: 'Fecha de creación' }),
  enabled: new SelectOption({ id: 5, code: 'enabled', name: 'Habilitado' }),
  id: new SelectOption({ id: 6, code: 'id', name: 'ID' }),
  isSelected: new SelectOption({ id: 7, code: 'isSelected', name: 'Seleccionado' }),
  visible: new SelectOption({ id: 8, code: 'visible', name: 'Visible' }),
});

export class MaritalStatus extends Entity {
  code = '';

  constructor() {
    super();
  }
}

export class MaritalStatusParams extends EntityParams<MaritalStatus> implements IParams {
  constructor(key: string) {
    super(key);
  }

  get httpParams(): HttpParams {
    return buildHttpParams(omitKeys(this, ['key', 'httpParams', 'id']));
  }

  private isSelectItemArray(array: any[]): array is SelectOption[] {
    return array.length > 0 && typeof array[0] === 'object' && 'value' in array[0];
  }
}

@Injectable({
  providedIn: 'root',
})
export class MaritalStatusesService extends ServiceHelper<MaritalStatus, MaritalStatusParams, FormGroup2<MaritalStatusParams>, 'MaritalStatuses'> {
  constructor() {
    super(MaritalStatusParams, 'maritalStatuses', {
      MaritalStatuses: new NamingSubject('maritalStatuses', 'ocupación', 'ocupaciones', 'Ocupaciones', 'femenine', 'admin'),
    }, {
      MaritalStatuses: [
        new Column('id', 'ID'),
        new Column('code', 'Código'),
        new Column('name', 'Nombre'),
        new Column('description', 'Descripción'),
        new Column('createdAt', 'Fecha de creación'),
        new Column('enabled', 'Habilitado'),
        new Column('visible', 'Visible'),
      ]
    }
  );
  }

  private detailModalRef: BsModalRef<MaritalStatusDetailModalComponent> = new BsModalRef<MaritalStatusDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private filterModalRef: BsModalRef<MaritalStatusesFilterModalComponent> = new BsModalRef<MaritalStatusesFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<MaritalStatusesCatalogModalComponent> = new BsModalRef<MaritalStatusesCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, view: View): void => {
    this.catalogModalRef = this.bsModalService.show(MaritalStatusesCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key, view: view } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(MaritalStatusesFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (item: MaritalStatus | undefined = undefined, key: string | undefined = undefined, use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.detailModalRef = this.bsModalService.show(MaritalStatusDetailModalComponent, {
      class: "modal-dialog-centered modal-lg",
      initialState: { item: item, use: use, key: key, title: undefined, view: "modal" }} as ModalOptions<MaritalStatusDetailModalComponent>);
  } else {
    this.bsModalService.hide();
    switch (use) {
      case "create":
        this.router.navigate([this.dictionary.MaritalStatuses.createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary.MaritalStatuses.catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary.MaritalStatuses.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  };
}


@Component({
  selector: 'maritalStatuses-route',
  template: `
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
})
export class MaritalStatusesComponent {
  dev = inject(EnvService);
}

@Component({
  selector: 'maritalStatuses-catalog-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li active [label]="label"></li>
    </nav>
  <div
    maritalStatusesCatalog
    [mode]="mode"
    [key]="key"
    [view]="view"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, MaritalStatusesCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent implements OnInit {
  service = inject(MaritalStatusesService);
  compact = inject(CompactTableService);
  router = inject(Router);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.router.url;
  section: Sections = 'maritalStatuses';
  label = this.service.dictionary['MaritalStatuses'].pluralTitlecase;

  constructor() {
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'maritalStatus-detail-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'maritalStatuses'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>

    @if (id && item) {
      <div maritalStatusDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, MaritalStatusDetailComponent, BreadcrumbsModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: MaritalStatus;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
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
  selector: 'maritalStatus-edit-route',
  template: `
  <nav breadcrumbs>
    <li item [section]="'admin'"></li>
      <li item [section]="'maritalStatuses'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>
      @if (id && item) {
        <div maritalStatusDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
      }
  `,
  standalone: true,
  imports: [MaritalStatusDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: MaritalStatus;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
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
  selector: 'maritalStatus-new-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'maritalStatuses'"></li>
      <li active [label]="'Crear'"></li>
    </nav>

  <div maritalStatusDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>`
  ,
  standalone: true,
  imports: [MaritalStatusDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  item = undefined;
  key = createId();
}

export const itemResolver: ResolveFn<MaritalStatus | null> = (route, state) => {
  const service = inject(MaritalStatusesService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ocupaciones', data: { breadcrumb: 'Ocupaciones', },
      component: MaritalStatusesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ocupaciones', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nueva ocupación', data: { breadcrumb: 'Nuevo', }, },
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
export class MaritalStatusesRoutingModule { }

@NgModule({
  declarations: [
    MaritalStatusesComponent,
  ],
  imports: [ CommonModule, MaritalStatusesRoutingModule, ]
})
export class MaritalStatusesModule { }
