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
import { EducationLevelsCatalogComponent } from 'src/app/educationLevels/components/educationLevels-catalog.component';
import { EducationLevelDetailModalComponent, EducationLevelsFilterModalComponent, EducationLevelsCatalogModalComponent } from 'src/app/educationLevels/modals';
import { EducationLevelDetailComponent } from 'src/app/educationLevels/views';


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

export class EducationLevel extends Entity {
  code = '';

  constructor() {
    super();
  }
}

export class EducationLevelParams extends EntityParams<EducationLevel> implements IParams {
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
export class EducationLevelsService extends ServiceHelper<EducationLevel, EducationLevelParams, FormGroup2<EducationLevelParams>, 'EducationLevels'> {
  constructor() {
    super(EducationLevelParams, 'educationLevels', {
      EducationLevels: new NamingSubject('educationLevels', 'ocupación', 'ocupaciones', 'Ocupaciones', 'femenine', 'admin'),
    }, {
      EducationLevels: [
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

  private detailModalRef: BsModalRef<EducationLevelDetailModalComponent> = new BsModalRef<EducationLevelDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private filterModalRef: BsModalRef<EducationLevelsFilterModalComponent> = new BsModalRef<EducationLevelsFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<EducationLevelsCatalogModalComponent> = new BsModalRef<EducationLevelsCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, view: View): void => {
    this.catalogModalRef = this.bsModalService.show(EducationLevelsCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key, view: view } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(EducationLevelsFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (item: EducationLevel | undefined = undefined, key: string | undefined = undefined, use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.detailModalRef = this.bsModalService.show(EducationLevelDetailModalComponent, {
      class: "modal-dialog-centered modal-lg",
      initialState: { item: item, use: use, key: key, title: undefined, view: "modal" }} as ModalOptions<EducationLevelDetailModalComponent>);
  } else {
    this.bsModalService.hide();
    switch (use) {
      case "create":
        this.router.navigate([this.dictionary.EducationLevels.createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary.EducationLevels.catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary.EducationLevels.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  };
}


@Component({
  selector: 'educationLevels-route',
  template: `
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
})
export class EducationLevelsComponent {
  dev = inject(EnvService);
}

@Component({
  selector: 'educationLevels-catalog-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li active [label]="label"></li>
    </nav>
  <div
    educationLevelsCatalog
    [mode]="mode"
    [key]="key"
    [view]="view"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, EducationLevelsCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent implements OnInit {
  service = inject(EducationLevelsService);
  compact = inject(CompactTableService);
  router = inject(Router);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.router.url;
  section: Sections = 'educationLevels';
  label = this.service.dictionary['EducationLevels'].pluralTitlecase;

  constructor() {
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'educationLevel-detail-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'educationLevels'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>

    @if (id && item) {
      <div educationLevelDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, EducationLevelDetailComponent, BreadcrumbsModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: EducationLevel;
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
  selector: 'educationLevel-edit-route',
  template: `
  <nav breadcrumbs>
    <li item [section]="'admin'"></li>
      <li item [section]="'educationLevels'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>
      @if (id && item) {
        <div educationLevelDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
      }
  `,
  standalone: true,
  imports: [EducationLevelDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: EducationLevel;
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
  selector: 'educationLevel-new-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'educationLevels'"></li>
      <li active [label]="'Crear'"></li>
    </nav>

  <div educationLevelDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>`
  ,
  standalone: true,
  imports: [EducationLevelDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  item = undefined;
  key = createId();
}

export const itemResolver: ResolveFn<EducationLevel | null> = (route, state) => {
  const service = inject(EducationLevelsService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ocupaciones', data: { breadcrumb: 'Ocupaciones', },
      component: EducationLevelsComponent, runGuardsAndResolvers: 'always',
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
export class EducationLevelsRoutingModule { }

@NgModule({
  declarations: [
    EducationLevelsComponent,
  ],
  imports: [ CommonModule, EducationLevelsRoutingModule, ]
})
export class EducationLevelsModule { }
