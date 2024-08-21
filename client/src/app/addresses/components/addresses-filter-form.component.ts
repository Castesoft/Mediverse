import { Component, effect, input, InputSignal, model, OnInit } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { Addresses, CatalogMode, FormUse, View } from "src/app/_models/types";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ControlSelectComponent } from "src/app/_forms/control-select.component";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Control, FilterFormActions, FormComponent } from "src/app/_forms/form";
import { CommonModule } from "@angular/common";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { Address, AddressesFilterForm, AddressesService, AddressParams } from "src/app/addresses/addresses.config";
import { omitKeys } from "src/app/_utils/util";
import { Validators } from "@angular/forms";
import { ServiceHelper } from "src/app/_services/serviceHelper";

@Component({
  selector: '[addressesFilterForm]',
  template: `
  @if(role() === 'compact') {
<form [formGroup]="form.group" [id]="form.id" (ngSubmit)="onSubmit()">
  <div class="d-flex align-items-center gap-3">
    <div controlSearchText [(control)]="form.controls['search']"></div>
    <mat-button-toggle-group name="ingredients" aria-label="Ingredients" multiple>
      <mat-button-toggle (click)="toggle.set(!toggle())" [value]="toggle()" [checked]="toggle()">
        <mat-icon>filter_alt</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  </div>
</form>
}

@if(role() === 'collapse') {
<form [formGroup]="form.group" [id]="form.id" (ngSubmit)="onSubmit()">
  <mat-accordion class="example-headers-align" [displayMode]="'flat'">
    <mat-expansion-panel hideToggle class="border" [(expanded)]="toggle">
      <mat-expansion-panel-header>
        <mat-panel-title>Filtros</mat-panel-title>
      </mat-expansion-panel-header>

      <div formBuilder [controls]="form.getControls(['search', 'sort', 'isSortAscending', 'dateFrom'])" [rows]="4" [(form)]="form"></div>
      <div formBuilder [controls]="form.getControls(['pageSize', 'pageNumber'])" [rows]="2"></div>
      <button type="submit" class="me-2"  [attr.form]="form.id" mat-flat-button color="primary">Buscar</button>
      <button type="button" color="secondary" mat-stroked-button (click)="service.downloadXLSX$(key(), 'Clinic')">Descargar</button>
    </mat-expansion-panel>
  </mat-accordion>
</form>
}

  `,
  standalone: true,
  imports: [ FontAwesomeModule, CollapseModule,
    ControlSelectComponent, ModalModule, ControlsModule,
    CommonModule, CdkModule, MaterialModule,
   ],
})
export class AddressesFilterFormComponent extends FormComponent<
  AddressesService
> implements OnInit, FilterFormActions<Address, AddressParams, AddressesFilterForm<AddressParams>> {
  item: InputSignal<Address | undefined> = input.required();
  use: InputSignal<FormUse> = input.required();
  view: InputSignal<View> = input.required();
  key: InputSignal<string> = input.required();
  role: InputSignal<string> = input.required();
  formId: InputSignal<string> = input.required();
  mode: InputSignal<CatalogMode> = input.required();

  readonly toggle = model.required();

  private ngUnsubscribe = new Subject<void>();
  params!: AddressParams;
  form: AddressesFilterForm<AddressParams>;

  constructor() {
    super(AddressesService);

    this.form = new AddressesFilterForm<AddressParams>({
      // methods & irrelevant
      httpParams: new Control('text', 'Parámetros HTTP', 'httpParams'),
      key: new Control('text', 'Clave', 'key'),
      updateFromPartial: new Control('text', 'Actualizar desde parcial', 'updateFromPartial'),
      paramsValue: new Control('text', 'Valor de parámetros', 'paramsValue'),
      // value: new Control('text', 'Valor', 'value'),

      // base
      pageSize: new Control('number', 'Tamaño de página', 'pageSize'),
      pageNumber: new Control('number', 'Número de página', 'pageNumber'),
      isSortAscending: new Control<boolean>('slideToggle', 'Orden ascendente', 'isSortAscending'),
      description: new Control('text', 'Descripción', 'description'),
      search: new Control('search', 'Buscar', 'search'),
      sort: new Control<string>('select', 'Ordenar', 'sort'),
      dateFrom: new Control('dateRange', 'Fecha desde', 'dateFrom'),
      dateTo: new Control('dateRange', 'Fecha hasta', 'dateTo'),
      id: new Control('text', 'Número', 'id'),
      name: new Control('text', 'Nombre', 'name'),

      // properties
      city: new Control("text", "Ciudad", "city", { validators: [ Validators.required] }),
      country: new Control("text", "País", "country", { validators: [ Validators.required] }),
      exteriorNumber: new Control("text", "Número exterior", "exteriorNumber", { validators: [ Validators.required] }),
      state: new Control("text", "Estado", "state", { validators: [ Validators.required] }),
      street: new Control("text", "Calle", "street", { validators: [ Validators.required] }),
      zipcode: new Control("text", "Código postal", "zipcode", { validators: [ Validators.required] }),
      interiorNumber: new Control("text", "Número interior", "interiorNumber"),
      latitude: new Control("text", "Latitud", "latitude"),
      longitude: new Control("text", "Longitud", "longitude"),
      neighborhood: new Control("text", "Colonia", "neighborhood"),
      photoUrl: new Control("text", "URL de la foto", "photoUrl"),
      type: new Control("text", "Tipo", "type"),
    }, { orientation: 'inline', columns: this.service.columns['Clinic'] });
    effect(() => {
      this.params = new AddressParams(this.key());
      this.form.setUse(this.use());
      this.form.patch(this.use(), this.params);
    });
  }

  onCancel(): void {

  }

  ngOnInit(): void {
    this.service.param$(this.key(), this.mode()).subscribe({
      next: params => {
        this.params = params;
        this.form.patch(this.use(), params);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    const result = omitKeys(this.form.value, ['httpParams', 'paramsValue', 'updateFromPartial', 'key']);
    this.service.submitForm(this.key(), result as AddressParams);
  }
}
