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
import { ConsumptionLevelsCatalogComponent } from 'src/app/consumptionLevels/components/consumptionLevels-catalog.component';
import { ConsumptionLevelDetailModalComponent, ConsumptionLevelsFilterModalComponent, ConsumptionLevelsCatalogModalComponent } from 'src/app/consumptionLevels/modals';
import { ConsumptionLevelDetailComponent } from 'src/app/consumptionLevels/views';


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

export class ConsumptionLevel extends Entity {
  code = '';

  constructor() {
    super();
  }
}

export class ConsumptionLevelParams extends EntityParams<ConsumptionLevel> implements IParams {
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
export class ConsumptionLevelsService extends ServiceHelper<ConsumptionLevel, ConsumptionLevelParams, FormGroup2<ConsumptionLevelParams>, 'ConsumptionLevels'> {
  constructor() {
    super(ConsumptionLevelParams, 'consumptionLevels', {
      ConsumptionLevels: new NamingSubject('consumptionLevels', 'ocupación', 'ocupaciones', 'Ocupaciones', 'femenine', 'admin'),
    }, {
      ConsumptionLevels: [
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

  private detailModalRef: BsModalRef<ConsumptionLevelDetailModalComponent> = new BsModalRef<ConsumptionLevelDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private filterModalRef: BsModalRef<ConsumptionLevelsFilterModalComponent> = new BsModalRef<ConsumptionLevelsFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<ConsumptionLevelsCatalogModalComponent> = new BsModalRef<ConsumptionLevelsCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, view: View): void => {
    this.catalogModalRef = this.bsModalService.show(ConsumptionLevelsCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key, view: view } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(ConsumptionLevelsFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (item: ConsumptionLevel | undefined = undefined, key: string | undefined = undefined, use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.detailModalRef = this.bsModalService.show(ConsumptionLevelDetailModalComponent, {
      class: "modal-dialog-centered modal-lg",
      initialState: { item: item, use: use, key: key, title: undefined, view: "modal" }} as ModalOptions<ConsumptionLevelDetailModalComponent>);
  } else {
    this.bsModalService.hide();
    switch (use) {
      case "create":
        this.router.navigate([this.dictionary.ConsumptionLevels.createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary.ConsumptionLevels.catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary.ConsumptionLevels.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  };
}


@Component({
  selector: 'consumptionLevels-route',
  template: `
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
})
export class ConsumptionLevelsComponent {
  dev = inject(EnvService);
}

@Component({
  selector: 'consumptionLevels-catalog-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li active [label]="label"></li>
    </nav>
  <div
    consumptionLevelsCatalog
    [mode]="mode"
    [key]="key"
    [view]="view"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, ConsumptionLevelsCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent implements OnInit {
  service = inject(ConsumptionLevelsService);
  compact = inject(CompactTableService);
  router = inject(Router);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.router.url;
  section: Sections = 'consumptionLevels';
  label = this.service.dictionary['ConsumptionLevels'].pluralTitlecase;

  constructor() {
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'consumptionLevel-detail-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'consumptionLevels'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>

    @if (id && item) {
      <div consumptionLevelDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, ConsumptionLevelDetailComponent, BreadcrumbsModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: ConsumptionLevel;
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
  selector: 'consumptionLevel-edit-route',
  template: `
  <nav breadcrumbs>
    <li item [section]="'admin'"></li>
      <li item [section]="'consumptionLevels'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>
      @if (id && item) {
        <div consumptionLevelDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
      }
  `,
  standalone: true,
  imports: [ConsumptionLevelDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: ConsumptionLevel;
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
  selector: 'consumptionLevel-new-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'consumptionLevels'"></li>
      <li active [label]="'Crear'"></li>
    </nav>

  <div consumptionLevelDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>`
  ,
  standalone: true,
  imports: [ConsumptionLevelDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  item = undefined;
  key = createId();
}

export const itemResolver: ResolveFn<ConsumptionLevel | null> = (route, state) => {
  const service = inject(ConsumptionLevelsService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ocupaciones', data: { breadcrumb: 'Ocupaciones', },
      component: ConsumptionLevelsComponent, runGuardsAndResolvers: 'always',
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
export class ConsumptionLevelsRoutingModule { }

@NgModule({
  declarations: [
    ConsumptionLevelsComponent,
  ],
  imports: [ CommonModule, ConsumptionLevelsRoutingModule, ]
})
export class ConsumptionLevelsModule { }
