import { Component, HostBinding, inject, input, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {GuidService} from "src/app/_services/guid.service";
import { IconsService } from "src/app/_services/icons.service";
import { Pagination } from "src/app/_models/pagination";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Subject, takeUntil } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { AlertModule } from "ngx-bootstrap/alert";
import { CatalogMode, Role, View } from "src/app/_models/types";
import { Router, RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FilterForm, User, UserParams } from "src/app/_models/user";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { CatalogModule } from "src/app/_shared/catalog.module";
import {UsersFilterMenuComponent} from "src/app/users/components/users-filter-menu.component";
import { UsersTableComponent } from "src/app/users/components/users-table.component";
import { UsersService } from "src/app/_services/users.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { CdkModule } from "src/app/_shared/cdk.module";

@Component({
  host: { class: 'mh-300px scroll-y me-n7 pe-7', },
  selector: 'div[usersListSelect]',
  template: `
  @if(data && pagination) {
    <div class="fs-6 fw-semibold mb-2 mt-5">{{service.namingDictionary.get(role())!.title}}</div>
    @for(item of data; let idx = $index; track idx) {
      <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed"
      [cdkContextMenuTriggerFor]="context_menu">
      <div class="d-flex align-items-center">
        @switch(mode()) {
          @case ("select") {
            <div class="form-check form-check-sm form-check-custom form-check-solid">
              <input
                class="form-check-input"
                type="radio"
                [name]="service.namingDictionary.get(role())!.singular"
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
                [name]="service.namingDictionary.get(role())!.singular"
                [checked]="item.isSelected"
                [id]="cuid + 'tableCheck' + idx"
                (change)="service.addSelected$(key(), item)"
              />
            </div>
          }
        }
          <div class="symbol symbol-35px symbol-circle ms-4">
            @if (item.photoUrl) {
            <img [src]="item.photoUrl" [alt]="item.fullName" />
            } @else {
            <div class="symbol-label fs-3 bg-light-danger text-danger">
              {{ item.firstName[0] }}
            </div>
            }
          </div>
          <div class="ms-5">
            <a (click)="service.clickLink(role(), item.id, item, key(), 'detail', 'modal')" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">{{item.fullName}}</a>
            <div class="fw-semibold text-muted">{{item.email}}</div>
          </div>
        </div>
        <div class="ms-2 w-100px">
        <a class="btn btn-light btn-active-light-primary btn-flex btn-center btn-sm"
           [cdkContextMenuTriggerFor]="context_menu" [cdkMenuTriggerFor]="context_menu"
           [id]="'dropdown' + item.fullName + item.id" type="button"
           [attr.aria-controls]="'dropdown' + item.fullName + item.id">
          Opciones
          <i class="ki-duotone ki-down fs-5 ms-1"></i>
        </a>
				</div>
      </div>
      <ng-template #context_menu>
        <div
          class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4 show"
          cdkMenu>
          <div cdkMenuItem class="menu-item px-3">
            <a [routerLink]="[service.namingDictionary.get(role())!.catalogRoute,item.id]" class="menu-link">Ver</a>
          </div>
          <div cdkMenuItem class="menu-item px-3">
            <a [routerLink]="[service.namingDictionary.get(role())!.catalogRoute, item.id, 'edit']" class="menu-link">Editar</a>
          </div>
          <button cdkMenuItem class="menu-item px-3 text-danger" (click)="service.delete$(item, role())">
            <a class="menu-link">Eliminar</a>
          </button>
        </div>
      </ng-template>
    }

  }
  `,
  standalone: true,
  imports: [ BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    UsersTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, UsersFilterMenuComponent, LayoutModule, CdkModule,
   ],
})
export class UsersListSelectComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(UsersService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  role = input.required<Role>();

  data?: User[];
  params!: UserParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  cuid: string;
  private ngUnsubscribe = new Subject<void>();

  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    this.params = new UserParams(this.key());

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

  private loadData(params: UserParams) {
    console.log(this.role(), this.key());
    this.service.loadPagedList(this.role(), this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
      },
    });
  }
}

@Component({
  host: {  },
  selector: 'div[usersCatalog]',
  template: `
    <div catalogCardHeader>
      <div class="card-title">
        <form [formGroup]="form.group" (ngSubmit)="onSubmit()" [id]="form.id">
          <div searchText formControlName="search" [naming]="service.namingDictionary.get(role())!"></div>
        </form>
      </div>
      <div class="card-toolbar">
        @if (service.hasSelected(key()) && mode() === 'view') {
          <div deleteSelectedBtn [count]="service.selectedCount(key())"
                (click)="service.deleteRange$(key(), role())"></div>
        }
        @if (!service.hasSelected(key())) {
          <div class="d-flex justify-content-end">
            <button filterMenuBtn (click)="service.showFiltersModal(key(), role())"></button>
            <users-filter-menu></users-filter-menu>
            <button exportBtn (click)="service.downloadXLSX$(key(), role())"></button>
            <button createBtn [naming]="service.namingDictionary.get(role())!"
                    (click)="service.clickLink(role(), null, null, key(), 'create', view())"
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
              {{ service.namingDictionary.get(role())?.singularTitlecase }} @if (service.namingDictionary.get(role())?.articleSex === 'masculine') {
                seleccionado
              } @else {
                seleccionada
              }
            }
            @case ("multiselect") {
              {{ service.namingDictionary.get(role())?.pluralTitlecase }} @if (service.namingDictionary.get(role())?.articleSex === 'masculine') {
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
              usersTable
              [data]="mode() === 'select' ? service.getSelected$(key()) : []"
              [role]="role()"
              [view]="view()"
              [key]="key()"
              [mode]="'readonly'"
              [showHeaders]="false"
            ></table>
          </div>
        } @else {
          @switch (mode()) {
            @case ("select") {
              No tienes {{ service.namingDictionary.get(role())!.undefinedArticle }} {{ service.namingDictionary.get(role())!.singular }} @if (service.namingDictionary.get(role())?.articleSex === 'masculine') {
                seleccionado
              } @else {
                seleccionada
              }.
            }
            @case ("multiselect") {
              No tienes {{ service.namingDictionary.get(role())!.plural }} @if (service.namingDictionary.get(role())?.articleSex === 'masculine') {
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
              usersTable
              [data]="data"
              [mode]="mode()"
              [key]="key()"
              [role]="role()"
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
                {{ service.namingDictionary.get(role())!.pluralTitlecase }} no encontrados
              </h4>
              <p class="mb-4">
                No se encontraron {{ service.namingDictionary.get(role())!.plural }} que coincidan con los
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
    UsersTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, UsersFilterMenuComponent, LayoutModule,
   ],
})
export class UsersCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(UsersService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  role = input.required<Role>();

  data?: User[];
  params!: UserParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new UserParams(this.key());

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

  private loadData(params: UserParams) {
    console.log(this.role(), this.key());
    this.service.loadPagedList(this.role(), this.key(), params).subscribe({
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
