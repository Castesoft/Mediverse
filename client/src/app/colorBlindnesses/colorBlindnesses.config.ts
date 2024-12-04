import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, effect, inject, Injectable, input, InputSignal, model, ModelSignal, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsModalRef, ModalModule, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { FilterFormGroupActions, FormComponent, FormGroupActions, SelectOption } from 'src/app/_forms/form';
import { FormGroup2, FormInfo } from 'src/app/_forms/form2';
import { Pagination } from 'src/app/_models/pagination';
import { BadRequest, CatalogMode, Column, Entity, EntityParams, FormUse, IParams, ITableMenu, NamingSubject, PartialCellsOf, Sections, TableCellItem, TableMenu, TableRow, View } from 'src/app/_models/types';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { EnvService } from 'src/app/_services/env.service';
import { IconsService } from 'src/app/_services/icons.service';
import { ServiceHelper } from 'src/app/_services/serviceHelper';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';
import { CatalogModal, DetailModal, FilterModal, TableModule } from 'src/app/_shared/table/table.module';
import { BreadcrumbsModule } from 'src/app/_utils/breadcrumbs.module';
import { buildHttpParams, omitKeys } from 'src/app/_utils/util';

@Component({
  selector: 'div[colorBlindnessesTableMenu]',
  host: { class: '' },
  template: `
    <div class="dropdown-menu d-block" cdkMenu>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.catalogRoute + '/' + item().id"
        (click)="
          service.clickLink(item(), key(), 'detail', 'page');
          $event.preventDefault()
        "
      >
        Ver {{ service.dictionary.singular }}
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.catalogRoute + '/' + item().id"
        (click)="
          $event.preventDefault();
          service.clickLink(item(), key(), 'detail', 'modal')
        "
      >
        Abrir {{ service.dictionary.singular }} en pantalla modal
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [routerLink]="[service.dictionary.catalogRoute, item().id, 'editar']"
      >
        Editar
      </a>
      <button
        cdkMenuItem
        class="dropdown-item px-3 text-danger"
        (click)="service.delete$(item())"
      >
        Eliminar
      </button>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, CdkModule, MaterialModule],
})
export class ColorBlindnessesTableMenuComponent
  extends TableMenu<ColorBlindnessesService>
  implements OnInit, ITableMenu<ColorBlindness>
{
  item: ModelSignal<ColorBlindness> = model.required();
  key: ModelSignal<string> = model.required();

  constructor() {
    super(ColorBlindnessesService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table fs-9 mb-0 border-translucent' },
  selector: 'table[colorBlindnessesTable]',
  template: `
    <thead
      tableHeader
      [columns]="service.columns"
      [params]="params"
      (onParamsChange)="service.onSortOptionsChange(key(), $event)"
      [mode]="mode()"
      (selectedChange)="service.onSelectAll(key(), mode(), $event)"
      [selected]="(service.areAllSelected(key()) | async)!"
    ></thead>
    <tbody class="list" id="leal-tables-body">
      @for (item of data(); track item.id; let idx = $index) {
        <tr
          class="hover-actions-trigger btn-reveal-trigger position-static"
          [cdkContextMenuTriggerFor]="context_menu"
        >
          <td
            tableCheckCell
            [idx]="idx"
            [dictionary]="service.dictionary"
            [(selected)]="item.isSelected"
            (click)="service.onSelect(key(), mode(), item)"
          ></td>

          <td
            class="name align-middle white-space-nowrap px-0 py-0"
            [ngStyle]="true ? {} : { cursor: 'pointer' }"
          >
            <div class="d-flex align-items-center justify-content-start px-0">
              <a
                [routerLink]="[service.dictionary.catalogRoute, item.id]"
                [href]="[service.dictionary.catalogRoute, item.id]"
                class="fw-semibold text-primary"
                >#{{ item.id | number }}</a
              >
            </div>
          </td>

          @for (
            cell of row.getItems([
              'code',
              'name',
              'description',
              'createdAt',
              'visible',
              'enabled',
            ]);
            let idx = $index;
            track idx
          ) {
            <td
              tableCell2
              [item]="cells[cell.item.key]!"
              [value]="item[cell.item.key]"
            ></td>
          }

          <td
            tableMenuCell
            [item]="item"
            [contextMenu]="context_menu"
          ></td>
          <ng-template #context_menu>
            <div colorBlindnessesTableMenu [item]="item" [key]="key()"></div>
          </ng-template>
        </tr>
      }
    </tbody>
  `,
  standalone: true,
  imports: [
    TableModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    ColorBlindnessesTableMenuComponent,
  ],
})
export class ColorBlindnessesTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(ColorBlindnessesService);
  icons = inject(IconsService);
  dev = inject(EnvService);

  data = input.required<ColorBlindness[]>();
  mode = model.required<CatalogMode>();
  key = model.required<string>();
  view = model.required<View>();

  sortAscending = false;
  devMode = false;
  params!: ColorBlindnessParams;
  cuid = createId();
  selected = false;
  row: TableRow<ColorBlindness> = new TableRow<ColorBlindness>(new ColorBlindness());

  cells: PartialCellsOf<ColorBlindness> = {
    createdAt: new TableCellItem<Date, 'createdAt'>('createdAt', 'date', { fullDate: true, }),
    description: new TableCellItem<string, 'description'>('description', 'string'),
    enabled: new TableCellItem<boolean, 'enabled'>('enabled', 'boolean'),
    name: new TableCellItem<string, 'name'>('name', 'string'),
    code: new TableCellItem<string, 'code'>('code', 'string'),
    visible: new TableCellItem<boolean, 'visible'>('visible', 'boolean'),
    id: new TableCellItem<number, 'id'>('id', 'number'),
  };

  constructor() {
    effect(() => {
      this.params = new ColorBlindnessParams(this.key());
      this.service.param$(this.key(), this.mode()).subscribe({
        next: (params) => {
          this.params = params;
        },
      });
    });
  }

  ngOnInit(): void {
    this.subscribeToDevMode();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToDevMode = () => {
    this.dev.mode$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (devMode) => (this.devMode = devMode),
    });
  };
}


@Component({
  selector: '[colorBlindnessesFilterForm]',
  template: `
  @if(role() === 'compact') {
<form [id]="form.id" (ngSubmit)="onSubmit()">
  <div class="d-flex align-items-center gap-3">
    <div controlSearchText3 [(control)]="form.controls.search"></div>
    <div class="flex-grow-1">
    <mat-button-toggle-group name="ingredients" aria-label="Ingredients" multiple>
      <mat-button-toggle (click)="toggle.set(!toggle())" [value]="toggle()" [checked]="toggle()">
        <mat-icon>filter_alt</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
    </div>
  </div>
</form>
}

@if(role() === 'collapse') {
<form [id]="form.id" (ngSubmit)="onSubmit()">
  <mat-accordion class="example-headers-align" [displayMode]="'flat'">
    <mat-expansion-panel hideToggle class="border" [(expanded)]="toggle">
      <mat-expansion-panel-header>
        <mat-panel-title>Filtros</mat-panel-title>
      </mat-expansion-panel-header>

      <div formBuilder3 [controls]="[
        form.controls.search,
        form.controls.sort,
        form.controls.isSortAscending,
        form.controls.dateRange,
      ]" [cols]="4"></div>
      <div formBuilder3 [controls]="[
        form.controls.pageSize,
        form.controls.pageNumber,
      ]" [cols]="4"></div>
      <button type="submit" class="me-2"  [attr.form]="form.id" mat-flat-button color="primary">Buscar</button>
      <button type="button" color="secondary" mat-stroked-button (click)="service.downloadXLSX$(key())">Descargar</button>
    </mat-expansion-panel>
  </mat-accordion>
</form>
}

  `,
  standalone: true,
  imports: [ FontAwesomeModule, CollapseModule,
    ControlSelectComponent, ModalModule, ControlsModule,
    CommonModule, CdkModule, MaterialModule, FormNewModule,
   ],
})
export class ColorBlindnessesFilterFormComponent extends FormComponent<ColorBlindnessesService> implements OnInit, FilterFormGroupActions<ColorBlindness, ColorBlindnessParams, FormGroup2<ColorBlindnessParams>> {
  item: ModelSignal<ColorBlindness | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string> = model.required();
  role: ModelSignal<string> = model.required();
  formId: InputSignal<string> = input.required();
  mode: ModelSignal<CatalogMode> = model.required();

  readonly toggle = model.required();

  private ngUnsubscribe = new Subject<void>();
  params!: ColorBlindnessParams;
  info: FormInfo<ColorBlindnessParams> = {
    description: { label: 'Descripción', placeholder: 'Descripción', type: 'textarea' },
    id: { label: this.service.dictionary.singularTitlecase, type: 'number', isDisabled: true },
    name: { label: 'Nombre', placeholder: 'Nombre', type: 'text' },
    isSortAscending: { label: 'Orden ascendente', type: 'slideToggle', placeholder: 'Orden ascendente' },
    pageNumber: { label: 'Número de página', placeholder: 'Número de página', type: 'numberMat' },
    pageSize: { label: 'Tamaño de página', placeholder: 'Tamaño de página', type: 'numberMat' },
    search: { label: 'Buscar', placeholder: 'Buscar', type: 'search' },
    sort: { label: 'Ordenar', placeholder: 'Ordenar', type: 'selectMat', selectOptions: [] },
    dateFrom: { label: 'Fecha desde', placeholder: 'Fecha desde', type: 'dateRange' },
    dateTo: { label: 'Fecha hasta', placeholder: 'Fecha hasta', type: 'dateRange' },
    dateRange: { label: 'Rango de fechas', placeholder: 'Rango de fechas', type: 'dateRange' },

    httpParams: {} as any,
    key: {} as any,
    updateFromPartial: {} as any,
    paramsValue: {} as any,
  };

  form: FormGroup2<ColorBlindnessParams> = new FormGroup2<ColorBlindnessParams>(ColorBlindnessParams as any, new ColorBlindnessParams(createId()), this.info, { orientation: 'inline', use: 'filter' });

  constructor() {
    super(ColorBlindnessesService);

    this.form.controls.sort.selectOptions = sortOptions;
    this.form.controls.sort.setValue(sortOptions[0]);

    effect(() => {
      this.params = new ColorBlindnessParams(this.key());


      this.form.setUse(this.use());
    });
  }

  onCancel(): void {

  }

  ngOnInit(): void {
    this.service.param$(this.key(), this.mode()).subscribe({
      next: params => {
        this.params = params;
        // this.form.patch(this.use(), params);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.form.updateValueAndValidity();

    console.log('onSubmit', this.form.getRawValue());


    const result = omitKeys(this.form.value, ['httpParams', 'paramsValue', 'updateFromPartial', 'key']);
    this.service.submitForm(this.key(), result as any);
    // this.service.submitForm(this.key(), result as ColorBlindnessParams);
  }
}


@Component({
  selector: '[colorBlindnessesCatalog]',
  template: `
  <div class="pb-2">
  <h1 class="mb-4">{{ service.dictionary.title}}</h1>
  <div>
    <div class="row align-items-center justify-content-between g-3 mb-2">
      <div class="col-12 col-md-auto">
        <a type="button" class="btn btn-primary me-4" (click)="service.clickLink(undefined, key(), 'create', 'page')">
          <fa-icon [icon]="icons.faPlus" class="me-1" />
          Crear {{ service.dictionary.singular }}
        </a>
        @if (service.hasSelected(key(), mode()) | async) {
        @if (service.selectedCount(key(), mode()) | async; as count) {
        <button mat-raised-button [matBadge]="count" matBadgePosition="after" (click)="service.deleteRange$(key())">
          Eliminar {{ count > 1 ? service.dictionary.plural : service.dictionary.singular }}
        </button>
        }
        }
      </div>
      <div class="col-12 col-md-auto d-flex">
        <div colorBlindnessesFilterForm [formId]="formId" [(toggle)]="toggle" [item]="null" [key]="key()" [use]="'filter'"
          [view]="'inline'" [role]="'compact'" [mode]="mode()"></div>
      </div>
    </div>
    <div colorBlindnessesFilterForm [formId]="formId" [mode]="mode()" [(toggle)]="toggle" [item]="null" [key]="key()" [use]="'filter'" [view]="'inline'" [role]="'collapse'"></div>
  </div>
</div>
<div tableWrapper>
  <div tableResponsive>
    @if(service.list$(key(), mode()) | async; as _list) {
    <table colorBlindnessesTable [mode]="mode()" [data]="_list" [key]="key()" [view]="view()">
    </table>
    }
  </div>
  @if(service.pagination$(key()) | async; as _pagination) {
  <div tablePager [currentPage]="_pagination.currentPage"
    [itemsPerPage]="_pagination.itemsPerPage" [totalItems]="_pagination.totalItems" (loadMore)="service.loadMore(key())"
    (loadLess)="service.loadLess(key())" (pageChanged)="service.onPageChanged(key(), $event)"></div>
  }
</div>

  `,
  standalone: true,
  imports: [ FontAwesomeModule, ColorBlindnessesFilterFormComponent,
    ColorBlindnessesTableComponent, CommonModule,
    RouterModule, ControlsModule, TableModule, ColorBlindnessesFilterFormComponent,
    CdkModule, MaterialModule,
   ],
})
export class ColorBlindnessesCatalogComponent implements OnInit, OnDestroy {
  service = inject(ColorBlindnessesService);
  icons = inject(IconsService);
  private router = inject(Router);

  animalId = input<number>();
  isCompact = input.required<boolean>();
  mode = model.required<CatalogMode>();
  key = model.required<string>();
  view = model.required<View>();
  item = input<ColorBlindness>();

  toggle = model(false);

  params!: ColorBlindnessParams;
  formId = `${this.router.url}#form-${createId()}`;
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  pagination?: Pagination;
  list?: ColorBlindness[];

  constructor() {

    effect(() => {
      this.params = new ColorBlindnessParams(this.key());
      this.service.createEntry(this.key(), this.params, this.mode());

      this.service.cache$.subscribe({ next: cache => {
        this.service.loadPagedList(this.key(), this.params).subscribe();
      }});
    })
  }

  ngOnInit(): void {
    this.service.param$(this.key(), this.mode()).subscribe({ next: params => this.params = params });
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list = list });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination = pagination });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}


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
  constructor() {
    super();
  }
}

export class ColorBlindnessParams extends EntityParams<ColorBlindness> {
  constructor(key: string) {
    super(key);
  }
}

@Component({
  selector: "div[colorBlindnessForm]",
  template: `
  <form [id]="form.id" (ngSubmit)="onSubmit()">
  <div container [type]="'card'">
    @if (form.error) {
      <div errorsAlert [error]="form.error"></div>
    }
    <div formBuilder3 [controls]="[
      form.controls.id,
      form.controls.createdAt,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.code,
      form.controls.name,
    ]" [cols]="2"></div>
    <div formBuilder3 [controls]="[
      form.controls.description,
    ]" [cols]="1"></div>
    <div formBuilder3 [controls]="[
      form.controls.enabled,
    ]" [cols]="1"></div>
    <div formBuilder3 [controls]="[
      form.controls.visible,
    ]" [cols]="1"></div>
  </div>

  @if(use() !== 'detail') {
    <div container [type]="'inline'">
      <div detailFooter [use]="use()" [view]="view()" [id]="item() ? item()!.id! : undefined" [dictionary]="service.dictionary" [formId]="form.id"></div>
    </div>
  }
</form>

  `,
  standalone: true,
  imports: [ CommonModule, RouterModule, ControlsModule, FormNewModule, ]
})
export class ColorBlindnessFormComponent extends FormComponent<ColorBlindnessesService> implements OnInit, FormGroupActions<ColorBlindness, FormGroup2<ColorBlindness>> {
  item: ModelSignal<ColorBlindness | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string> = model.required();

  info: FormInfo<ColorBlindness> = {
    code: { label: 'Código', type: 'text' },
    createdAt: { label: 'Fecha de creación', type: 'date', isDisabled: true, },
    description: { label: 'Descripción', type: 'textarea' },
    enabled: { label: 'Habilitado', type: 'slideToggle', },
    id: { label: this.service.dictionary.singularTitlecase, type: 'number', isDisabled: true },
    isSelected: { label: 'Seleccionado', type: 'slideToggle' },
    name: { label: 'Nombre', type: 'text' },
    visible: { label: 'Visible', type: 'slideToggle' },
  } as FormInfo<ColorBlindness>;

  form: FormGroup2<ColorBlindness> = new FormGroup2<ColorBlindness>(ColorBlindness, new ColorBlindness(), this.info, { orientation: 'inline', use: 'create' });

  constructor() {
    super(ColorBlindnessesService);

    effect(() => {
      const value = this.item();

      if (value) {
        this.form.patchValue(value as any);
      }

      this.form.setUse(this.use());
    });
  }

  ngOnInit(): void {
    this.formsService.mode$.subscribe({ next: validation => {
      this.form.validation = validation;
    } });
  }

  onSubmit() {
    this.form.submitted = true;
    switch (this.use()) {
      case 'create':
        this.create();
        break;
      case 'edit':
        this.update();
        break;
    }
  }

  onCancel() {
    this.form.submitted = false;
    if (this.use() === 'create') {
      this.form.reset();
    } else if (this.use() === 'edit') {
      this.form.reset();
    }
  }

  create() {
    if (this.form.submittable) {
      this.service.create(this.form, this.view()).subscribe({
        next: response => {
          this.form.onSuccess(response);
          this.use.set('detail');
        },
        error: (error: BadRequest) => this.form.error = error
      });
    }
  }

  update() {
    if (this.form.submittable) {
      this.service.update(this.form, this.view()).subscribe({
        next: response => {
          this.form.onSuccess(response);
          this.use.set('detail');
        },
        error: (error: BadRequest) => this.form.error = error
      });
    }
  }
}

@Component({
  selector: 'div[colorBlindnessDetail]',
  template: `
  <div container [type]="'inline'">
    <div detailHeader [(use)]="use" [view]="view()" [dictionary]="service.dictionary" [id]="item() ? item()!.id! : undefined" (onDelete)="service.delete$(item()!)"></div>
  </div>
  <div colorBlindnessForm [item]="item()" [key]="key()" [use]="use()" [view]="view()"></div>
  `,
  standalone: true,
  imports: [ColorBlindnessFormComponent, ControlsModule,],
})
export class ColorBlindnessDetailComponent {
  service = inject(ColorBlindnessesService);

  use = model.required<FormUse>();
  view = model.required<View>();
  item = model.required<ColorBlindness | null>();
  key = model.required<string>();
}

@Component({
  selector: 'colorBlindness-detail-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div colorBlindnessDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ColorBlindnessDetailComponent, ModalWrapperModule],
})
export class ColorBlindnessDetailModalComponent extends DetailModal<ColorBlindness> {}

@Component({
  selector: 'colorBlindnesses-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div colorBlindnessesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ColorBlindnessesFilterFormComponent, ModalWrapperModule],
})
export class ColorBlindnessesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'colorBlindnesses-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            colorBlindnessesCatalog
            class="modal-body py-3 px-4"
            [mode]="mode"
            [key]="key"
            [view]="view"
            [isCompact]="true"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [ColorBlindnessesCatalogComponent, ModalWrapperModule],
})
export class ColorBlindnessesCatalogModalComponent extends CatalogModal {}

@Injectable({
  providedIn: 'root',
})
export class ColorBlindnessesService extends ServiceHelper<ColorBlindness, ColorBlindnessParams, FormGroup2<ColorBlindnessParams>> {
  constructor() {
    super(ColorBlindnessParams, 'colorBlindnesses', new NamingSubject(
      'feminine',
      'especialidad',
      'especialidades',
      'Especialidades',
      'colorBlindnesses',
      ['admin', 'utilerias', 'codigos'],
    ), [
      { name: 'id', label: 'ID' },
      { name: 'code', label: 'Código' },
      { name: 'name', label: 'Nombre' },
      { name: 'description', label: 'Descripción' },
      new Column('createdAt', 'Creado', { options: { justify: 'end', }}),
      { name: 'visible', label: 'Visible' },
      { name: 'enabled', label: 'Habilitado' },
    ]);
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

  clickLink = (item: ColorBlindness | undefined = undefined, key: string | undefined = undefined,
    use: FormUse = "detail", view: View) => {

  if (view === "modal") {
    this.detailModalRef = this.bsModalService.show(ColorBlindnessDetailModalComponent, {
      class: "modal-dialog-centered modal-lg",
      initialState: { item: item, use: use, key: key, title: undefined, view: "modal" }} as ModalOptions<ColorBlindnessDetailModalComponent>);
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
  selector: 'colorBlindnesses-route',
  template: `
  <router-outlet></router-outlet>
  `,
  standalone: false,
})
export class ColorBlindnessesComponent {
  dev = inject(EnvService);
}

@Component({
  selector: 'colorBlindnesses-catalog-route',
  template: `
  <nav breadcrumbs>
      <li item [section]="'admin'"></li>
      <li item [section]="'utils'"></li>
      <li active [label]="label"></li>
    </nav>
  <div
    colorBlindnessesCatalog
    [mode]="mode"
    [key]="key"
    [view]="view"
    [isCompact]="isCompact"
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
  label = this.service.dictionary.pluralTitlecase;

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
        if (this.item) this.label = this.item.id!.toString();
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
        if (this.item) this.label = this.item.id!.toString();
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
  item = null;
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
      path: '', title: 'Ganaderías', data: { breadcrumb: 'Ganaderías', },
      component: ColorBlindnessesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ganaderías', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nueva ganadería', data: { breadcrumb: 'Nuevo', }, },
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
