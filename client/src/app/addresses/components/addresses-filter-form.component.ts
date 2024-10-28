import { Component, effect, input, InputSignal, model, ModelSignal, OnInit } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CatalogMode, FormUse, View } from "src/app/_models/types";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ControlSelectComponent } from "src/app/_forms/control-select.component";
import { ControlsModule } from "src/app/_forms/controls.module";
import { FilterFormGroupActions, FormComponent } from "src/app/_forms/form";
import { CommonModule } from "@angular/common";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { AddressesService, AddressParams, sortOptions } from "src/app/addresses/addresses.config";
import { omitKeys } from "src/app/_utils/util";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";
import { createId } from "@paralleldrive/cuid2";
import { Address } from "src/app/_models/address";

@Component({
  selector: '[addressesFilterForm]',
  template: `
  @if(role() === 'compact') {
<form [id]="form.id" (ngSubmit)="onSubmit()">
  <div class="d-flex align-items-center gap-3">
    <div controlSearchText3 [(control)]="form.controls.search"></div>
    <mat-button-toggle-group name="ingredients" aria-label="Ingredients" multiple>
      <mat-button-toggle (click)="toggle.set(!toggle())" [value]="toggle()" [checked]="toggle()">
        <mat-icon>filter_alt</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
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
      <!-- <button type="button" color="secondary" mat-stroked-button (click)="service.downloadXLSX$(key(), 'Clinic')">Descargar</button> -->
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
export class AddressesFilterFormComponent extends FormComponent<
  AddressesService
> implements OnInit, FilterFormGroupActions<Address, AddressParams, FormGroup2<AddressParams>> {
  item: ModelSignal<Address | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string> = model.required();
  role: ModelSignal<string> = model.required();
  formId: InputSignal<string> = input.required();
  mode: ModelSignal<CatalogMode> = model.required();

  readonly toggle = model.required();

  private ngUnsubscribe = new Subject<void>();
  params!: AddressParams;

  info: FormInfo<AddressParams> = {
    city: { label: 'Ciudad', placeholder: 'Ciudad', type: 'text', },
    country: { label: 'País', placeholder: 'País', type: 'text', },
    description: { label: 'Descripción', placeholder: 'Descripción', type: 'text', },
    exteriorNumber: { label: 'Número exterior', placeholder: 'Número exterior', type: 'text', },
    id: { label: 'Dirección', placeholder: 'Dirección', type: 'number' },
    interiorNumber: { label: 'Número interior', placeholder: 'Número interior', type: 'text', },
    latitude: { label: 'Latitud', placeholder: 'Latitud', type: 'text', },
    longitude: { label: 'Longitud', placeholder: 'Longitud', type: 'text', },
    name: { label: 'Nombre', placeholder: 'Nombre', type: 'text', },
    neighborhood: { label: 'Colonia', placeholder: 'Colonia', type: 'text', },
    state: { label: 'Estado', placeholder: 'Estado', type: 'text', },
    street: { label: 'Calle', placeholder: 'Calle', type: 'text', },
    zipcode: { label: 'Código postal', placeholder: 'Código postal', type: 'text', },
    dateFrom: { label: 'Fecha desde', placeholder: 'Fecha desde', type: 'date', },
    dateRange: { label: 'Rango de fechas', placeholder: 'Rango de fechas', type: 'dateRange', },
    dateTo: { label: 'Fecha hasta', placeholder: 'Fecha hasta', type: 'date', },
    isSortAscending: { label: 'Orden ascendente', type: 'slideToggle', },
    pageNumber: { label: 'Número de página', placeholder: 'Número de página', type: 'number', },
    pageSize: { label: 'Tamaño de página', placeholder: 'Tamaño de página', type: 'number', },
    search: { label: 'Buscar', placeholder: 'Buscar', type: 'search', },
    sort: { label: 'Ordenar', placeholder: 'Ordenar', type: 'select', },
    photoUrl: { label: 'URL de la foto', placeholder: 'URL de la foto', type: 'text', },
    type: { label: 'Tipo', placeholder: 'Tipo', type: 'text', },

    httpParams: {} as any,
    key: {} as any,
    updateFromPartial: {} as any,
    paramsValue: {} as any,
  };

  form: FormGroup2<AddressParams> = new FormGroup2<AddressParams>(AddressParams as any, new AddressParams(createId()), this.info);

  constructor() {
    super(AddressesService);

    // this.form.controls.sort.selectOptions = sortOptions;
    // this.form.controls.sort.patchValue(sortOptions[0]);

    effect(() => {
      this.params = new AddressParams(this.key());

      this.form.setUse(this.use());
    });
  }

  onCancel(): void {

  }

  ngOnInit(): void {
    // this.service.param$(this.key(), this.mode()).subscribe({
    //   next: params => {
    //     this.params = params;
    //     // this.form.patch(this.use(), params);
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.form.updateValueAndValidity();

    console.log('onSubmit', this.form.getRawValue());


    const result = omitKeys(this.form.value, ['httpParams', 'paramsValue', 'updateFromPartial', 'key']);
    // this.service.submitForm(this.key(), result as any);
  }
}
