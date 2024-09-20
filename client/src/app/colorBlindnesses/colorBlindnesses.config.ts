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
import { ColorBlindnessesCatalogComponent } from 'src/app/colorBlindnesses/components/colorBlindnesses-catalog.component';
import { ColorBlindnessDetailModalComponent, ColorBlindnessesFilterModalComponent, ColorBlindnessesCatalogModalComponent } from 'src/app/colorBlindnesses/modals';
import { ColorBlindnessDetailComponent } from 'src/app/colorBlindnesses/views';


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

export class ColorBlindness extends Entity {
  code = '';

  constructor() {
    super();
  }
}

export class ColorBlindnessParams extends EntityParams<ColorBlindness> implements IParams {
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
export class ColorBlindnessesService extends ServiceHelper<ColorBlindness, ColorBlindnessParams, FormGroup2<ColorBlindnessParams>, 'ColorBlindnesses'> {
  constructor() {
    super(ColorBlindnessParams, 'colorBlindnesses', {
      ColorBlindnesses: new NamingSubject('colorBlindnesses', 'ocupación', 'ocupaciones', 'Ocupaciones', 'femenine', 'admin'),
    }, {
      ColorBlindnesses: [
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

  private detailModalRef: BsModalRef<ColorBlindnessDetailModalComponent> = new BsModalRef<ColorBlindnessDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private filterModalRef: BsModalRef<ColorBlindnessesFilterModalComponent> = new BsModalRef<ColorBlindnessesFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<ColorBlindnessesCatalogModalComponent> = new BsModalRef<ColorBlindnessesCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, view: View): void => {
    this.catalogModalRef = this.bsModalService.show(ColorBlindnessesCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key, view: view } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(ColorBlindnessesFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (item: ColorBlindness | undefined = undefined, key: string | undefined = undefined, use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.detailModalRef = this.bsModalService.show(ColorBlindnessDetailModalComponent, {
      class: "modal-dialog-centered modal-lg",
      initialState: { item: item, use: use, key: key, title: undefined, view: "modal" }} as ModalOptions<ColorBlindnessDetailModalComponent>);
  } else {
    this.bsModalService.hide();
    switch (use) {
      case "create":
        this.router.navigate([this.dictionary.ColorBlindnesses.createRoute]);
        break;
      case "edit":
        this.router.navigate([`${this.dictionary.ColorBlindnesses.catalogRoute}/${item?.id}/editar`]);
        break;
      case "detail":
        this.router.navigate([`${this.dictionary.ColorBlindnesses.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  };
}


@Component({
  selector: 'colorBlindnesses-route',
  template: `
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
})
export class ColorBlindnessesComponent {
  dev = inject(EnvService);
}

@Component({
  selector: 'colorBlindnesses-catalog-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li active [label]="label"></li>
    </nav>
  <div
    colorBlindnessesCatalog
    [mode]="mode"
    [key]="key"
    [view]="view"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, ColorBlindnessesCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent implements OnInit {
  service = inject(ColorBlindnessesService);
  compact = inject(CompactTableService);
  router = inject(Router);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.router.url;
  section: Sections = 'colorBlindnesses';
  label = this.service.dictionary['ColorBlindnesses'].pluralTitlecase;

  constructor() {
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'colorBlindness-detail-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'colorBlindnesses'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>

    @if (id && item) {
      <div colorBlindnessDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, ColorBlindnessDetailComponent, BreadcrumbsModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: ColorBlindness;
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
  selector: 'colorBlindness-edit-route',
  template: `
  <nav breadcrumbs>
    <li item [section]="'admin'"></li>
      <li item [section]="'colorBlindnesses'"></li>
      @if(label){<li active [label]="label"></li>}
    </nav>
      @if (id && item) {
        <div colorBlindnessDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>
      }
  `,
  standalone: true,
  imports: [ColorBlindnessDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: ColorBlindness;
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
  selector: 'colorBlindness-new-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'colorBlindnesses'"></li>
      <li active [label]="'Crear'"></li>
    </nav>

  <div colorBlindnessDetail [use]="use" [view]="view" [item]="item" [key]="key"></div>`
  ,
  standalone: true,
  imports: [ColorBlindnessDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  item = undefined;
  key = createId();
}

export const itemResolver: ResolveFn<ColorBlindness | null> = (route, state) => {
  const service = inject(ColorBlindnessesService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ocupaciones', data: { breadcrumb: 'Ocupaciones', },
      component: ColorBlindnessesComponent, runGuardsAndResolvers: 'always',
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
export class ColorBlindnessesRoutingModule { }

@NgModule({
  declarations: [
    ColorBlindnessesComponent,
  ],
  imports: [ CommonModule, ColorBlindnessesRoutingModule, ]
})
export class ColorBlindnessesModule { }
