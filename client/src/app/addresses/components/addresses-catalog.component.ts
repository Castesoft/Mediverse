import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, ModelSignal, model, input, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { Address } from "src/app/_models/addresses/address";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { AddressesService } from "src/app/addresses/addresses.config";
import { AddressesTableComponent } from "src/app/addresses/components/addresses-table.component";

@Component({
  selector: '[addressesCatalog]',
  template: `
<div class="py-2">
  @if(view() === 'page'){<h1 class="mb-4">{{ service.dictionary.title}}</h1>}
  <div class="row justify-content-between mb-2 row-gap-1">
    <div class="col-auto">
      <div class="d-flex align-items-center column-gap-3">
        <a mat-fab extended type="button" (click)="service.clickLink(undefined, key(), 'create', view()); $event.preventDefault()" [href]="service.dictionary.createRoute">
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
    </div>
    <form (ngSubmit)="onSubmit(key())" [id]="form.id" class="col-12 col-lg d-flex justify-content-end">
      <div class="row d-flex column-gap-3 row-gap-1 align-items-center">
        <div controlSearchText3 [(fromWrapper)]="fromWrapper" [(control)]="form.controls.search"></div>
        <button mat-button class="col-auto" type="button" (click)="form.resetForm()">Limpiar</button>
        <button mat-flat-button class="col-auto" type="submit" [attr.form]="form.id">Buscar</button>
        <div class="col-auto px-0">
          <div>
            <mat-button-toggle-group name="ingredients" aria-label="Ingredients" multiple>
              <mat-button-toggle (click)="toggle.set(!toggle())" [value]="toggle()" [checked]="toggle()">
                <mat-icon>filter_alt</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>

<form (ngSubmit)="onSubmit(key())" [id]="form.id" class="mb-2">
  <mat-accordion class="example-headers-align" [displayMode]="'flat'">
    <mat-expansion-panel hideToggle class="border" [(expanded)]="toggle">
      <mat-expansion-panel-header>
        <mat-panel-title>Filtros</mat-panel-title>
      </mat-expansion-panel-header>
      <!-- <div formBuilder3 [cols]="4" [controls]="[

      ]"></div> -->

    <div class="row d-flex column-gap-3 row-gap-1 align-items-center">
      <div controlSelect3 [(control)]="form.controls.sort" [(fromWrapper)]="fromWrapper"></div>
      <div controlSlide3 [(control)]="form.controls.isSortAscending" [(fromWrapper)]="fromWrapper"></div>
    </div>
    </mat-expansion-panel>
  </mat-accordion>
</form>

<div tableWrapper>
  <div tableResponsive>
    @if(service.list$(key(), mode()) | async; as _list) {
    <table addressesTable [(mode)]="mode" [(isCompact)]="isCompact" [data]="_list" [(key)]="key" [(view)]="view" [(item)]="item" [(params)]="params">
    </table>
    }
  </div>
  @if(service.pagination$(key()) | async; as _pagination) {
  <div tablePager [(isCompact)]="isCompact" [currentPage]="_pagination.currentPage"
    [itemsPerPage]="_pagination.itemsPerPage" [totalItems]="_pagination.totalItems" (loadMore)="service.loadMore(key())"
    (loadLess)="service.loadLess(key())" (pageChanged)="service.onPageChanged(key(), $event)"></div>
  }
</div>
  `,
  // templateUrl: './addresses-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    AddressesTableComponent, CommonModule,
    RouterModule, ControlsModule, TableModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class AddressesCatalogComponent
  extends BaseCatalog<Address, AddressParams, AddressFiltersForm, AddressesService>
  implements OnInit, OnDestroy, CatalogInputSignals<Address, AddressParams>
{
  item: ModelSignal<Address | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<AddressParams> = model.required();

  animalId = input<number>();

  constructor() {
    super(AddressesService, AddressFiltersForm);

    effect(() => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active())
      ;

      this.service.createEntry(this.key(), this.params(), this.mode());

      this.service.cache$.subscribe({
        next: cache => {
          this.service.loadPagedList(this.key(), this.params()).subscribe();
        }
      });
    });
  }

  ngOnInit(): void {
    // this.service.param$(this.key(), this.mode()).subscribe({ next: params => this.params = params });
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
