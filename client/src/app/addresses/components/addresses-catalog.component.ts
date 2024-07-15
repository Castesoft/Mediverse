import {DecimalPipe, NgClass} from "@angular/common";
import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Subject, takeUntil } from "rxjs";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Address, AddressParams, FilterForm } from "src/app/_models/address";
import { Pagination } from "src/app/_models/pagination";
import { Addresses, CatalogMode, View } from "src/app/_models/types";
import { AddressesService } from "src/app/_services/addresses.service";
import { GuidService } from "src/app/_services/guid.service";
import { IconsService } from "src/app/_services/icons.service";
import { CatalogModule } from "src/app/_shared/catalog.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { LayoutModule } from "src/app/_shared/layout.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { AddressesFilterMenuComponent } from "src/app/addresses/components/addresses-filter-menu.component";
import { AddressesTableComponent } from "src/app/addresses/components/addresses-table.component";

@Component({
  host: { class: 'mh-300px scroll-y me-n7 pe-7', },
  selector: 'div[addressesListSelect]',
  template: `
    @if (data && pagination) {
      <div class="fs-6 fw-semibold mb-2 mt-5">{{ service.namingDictionary.get(type())!.title }}</div>
      @for (item of data; let idx = $index; track idx; let last = $last) {
        <div class="d-flex flex-stack py-4"
             [ngClass]="{'border-bottom border-gray-300 border-bottom-dashed': !last}"
             [cdkContextMenuTriggerFor]="context_menu">
          <div class="d-flex align-items-center">
            @switch (mode()) {
              @case ("select") {
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="radio"
                    [name]="service.namingDictionary.get(type())!.singular"
                    [checked]="item.isSelected"
                    (change)="service.setSelected$(key(), item)"
                  />
                </div>
              }
              @case ("multiselect") {
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    [name]="service.namingDictionary.get(type())!.singular"
                    [checked]="item.isSelected"
                    [id]="cuid + 'tableCheck' + idx"
                    (change)="service.addSelected$(key(), item)"
                  />
                </div>
              }
            }
            <div class="d-flex ms-5 align-items-center">
              <a [routerLink]="[]" class="symbol symbol-50px">
                <span class="symbol-label"
                      style="background-image:url({{item ? item.photoUrl : 'media/misc/image.png'}});"></span>
              </a>
              <div class="ms-5">
                <a [routerLink]="[]" (click)="service.clickLink(type(), item.id, item, key(), 'detail', view())"
                   class="text-primary-800 text-hover-primary fs-5 fw-bold mb-1">{{ item.name }}
                  @if(item.isMain) { <span class="badge badge-light-success ms-2">Principal</span> }
                </a>
                <div class="fs-6 fw-bold">{{ item.street }} {{ item.exteriorNumber }}
                  {{ item.interiorNumber ? 'Int. ' + item.interiorNumber : '' }}, {{ item.neighborhood }}
                  , {{ item.city }}, {{ item.state }}, {{ item.country }}, {{ item.zipcode }}
                </div>
                <div class="text-muted fs-7 fw-bold">{{ item.description }}</div>
              </div>
            </div>
          </div>
          <div class="ms-2 w-100px">
            <a class="btn btn-light btn-active-light-primary btn-flex btn-center btn-sm"
               [cdkContextMenuTriggerFor]="context_menu" [cdkMenuTriggerFor]="context_menu"
               [id]="'dropdown' + item.name + item.id" type="button"
               [attr.aria-controls]="'dropdown' + item.name + item.id">

              <i class="ki-duotone ki-down fs-5 ms-1"></i>
            </a>
          </div>
        </div>
        <ng-template #context_menu>
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4 show"
            cdkMenu>
            <div cdkMenuItem class="menu-item px-3">
              <a [routerLink]="[service.namingDictionary.get(type())!.catalogRoute,item.id]" class="menu-link">Ver</a>
            </div>
            <div cdkMenuItem class="menu-item px-3">
              <a [routerLink]="[service.namingDictionary.get(type())!.catalogRoute, item.id, 'edit']" class="menu-link">Editar</a>
            </div>
            <button cdkMenuItem class="menu-item px-3 text-danger" (click)="service.delete$(item, type())">
              <a class="menu-link">Eliminar</a>
            </button>
          </div>
        </ng-template>
      }

    }
  `,
  standalone: true,
  imports: [BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    AddressesTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, AddressesFilterMenuComponent, LayoutModule, CdkModule, NgClass,
  ],
})
export class AddressesListSelectComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(AddressesService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  type = input.required<Addresses>();

  data?: Address[];
  params!: AddressParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  cuid: string;
  private ngUnsubscribe = new Subject<void>();

  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    this.params = new AddressParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.loadData(params);
        this.form.patchValue(params);
      });

    this.service.loading$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: AddressParams) {
    console.log(this.type(), this.key());
    this.service.loadPagedList(this.type(), this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
        if (this.mode() === 'select') {
          this.service.setSelected$(this.key(), response.result!.find((x) => x.isMain === true));
        }
      },
    });
  }
}

@Component({
  host: {  },
  selector: 'div[addressesCatalog]',
  template: `
    <div catalogCardHeader>
      <div class="card-title">
        <form [formGroup]="form.group" (ngSubmit)="onSubmit()" [id]="form.id">
          <div searchText formControlName="search" [naming]="service.namingDictionary.get(type())!"></div>
        </form>
      </div>
      <div class="card-toolbar">
        @if (service.hasSelected(key()) && mode() === 'view') {
          <div deleteSelectedBtn [count]="service.selectedCount(key())"
                (click)="service.deleteRange$(key(), type())"></div>
        }
        @if (!service.hasSelected(key())) {
          <div class="d-flex justify-content-end">
            <button filterMenuBtn (click)="service.showFiltersModal(key(), type())"></button>
            <addresses-filter-menu></addresses-filter-menu>
            <button exportBtn (click)="service.downloadXLSX$(key(), type())"></button>
            <button createBtn [naming]="service.namingDictionary.get(type())!"
                    (click)="service.clickLink(type(), null, null, key(), 'create', view())"
            ></button>
          </div>
        }
      </div>
    </div>

    <div cardBody>
      @if (mode() === "select" || mode() === "multiselect") {
        <h4>
          @switch (mode()) {
            @case ("select") {
              {{ service.namingDictionary.get(type())?.singularTitlecase }} @if (service.namingDictionary.get(type())?.articleSex === 'masculine') {
                seleccionado
              } @else {
                seleccionada
              }
            }
            @case ("multiselect") {
              {{ service.namingDictionary.get(type())?.pluralTitlecase }} @if (service.namingDictionary.get(type())?.articleSex === 'masculine') {
                seleccionados
              } @else {
                seleccionadas
              }
            }
          }
        </h4>
        @if (service.hasSelected$(key())) {
          <div tableWrapper class="mb-4">
            <table
              addressesTable
              [data]="mode() === 'select' ? service.getSelected$(key()) : []"
              [type]="type()"
              [view]="view()"
              [key]="key()"
              [mode]="'readonly'"
              [showHeaders]="false"
            ></table>
          </div>
        } @else {
          @switch (mode()) {
            @case ("select") {
              No tienes {{ service.namingDictionary.get(type())!.undefinedArticle }} {{ service.namingDictionary.get(type())!.singular }} @if (service.namingDictionary.get(type())?.articleSex === 'masculine') {
                seleccionado
              } @else {
                seleccionada
              }.
            }
            @case ("multiselect") {
              No tienes {{ service.namingDictionary.get(type())!.plural }} @if (service.namingDictionary.get(type())?.articleSex === 'masculine') {
                seleccionados
              } @else {
                seleccionadas
              }.
            }
          }
        }
      }

      @if (data && pagination) {
        @if (data.length > 0) {
          <div tableWrapper>
            <table
              addressesTable
              [data]="data"
              [mode]="mode()"
              [key]="key()"
              [type]="type()"
              [view]="view()"
            ></table>
          </div>
          <div
            tablePager
            [currentPage]="pagination.currentPage"
            (pageChanged)="service.onPageChanged(key(), $event)"
            [itemsPerPage]="pagination.itemsPerPage"
            [totalItems]="pagination.totalItems"
            (loadMore)="service.loadMore(key())"
            (loadLess)="service.loadLess(key())"
          ></div>
        } @else {
          <div style="border-radius: 0.7em" class="bg-white border">
            <alert type="unknown" class="mb-0 text-center">
              <h4 class="alert-heading mt-4 pt-4 mb-4 fw-bold">
                {{ service.namingDictionary.get(type())!.pluralTitlecase }} no encontrados
              </h4>
              <p class="mb-4">
                No se encontraron {{ service.namingDictionary.get(type())!.plural }} que coincidan con los
                criterios de búsqueda.
              </p>
              <p class="mb-4">
                <button
                  class="btn btn-phoenix-secondary me-2"
                  (click)="service.resetForm(key(), form)"
                >
                  Restablecer los filtros
                </button>
              </p>
            </alert>
          </div>
        }
      } @else {
        <div tableLoadingPlaceholder></div>
      }
    </div>
  `,
  standalone: true,
  imports: [ BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    AddressesTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, AddressesFilterMenuComponent, LayoutModule,
   ],
})
export class AddressesCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(AddressesService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  type = input.required<Addresses>();

  data?: Address[];
  params!: AddressParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new AddressParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.loadData(params);
        this.form.patchValue(params);
      });

    this.form.group.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));

    this.service.loading$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: AddressParams) {
    console.log(this.type(), this.key());
    this.service.loadPagedList(this.type(), this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
      },
    });
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.form.group;
    const { dateRange } = controls;

    this.params.updateFromPartial({
      ...value,
      dateFrom: dateRange.value[0],
      dateTo: dateRange.value[1],
    });
  };

  onSubmit() {
    this.service.setParam$(this.key(), this.params);
    this.form.patchValue(this.params);
  }
}
