import { Component, effect, input, InputSignal, model, OnInit } from "@angular/core";
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
import { omitKeys } from "src/app/_utils/util";
import { Disease, DiseaseParams, DiseasesService, sortOptions } from "src/app/diseases/diseases.config";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { createId } from "@paralleldrive/cuid2";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";

@Component({
  selector: '[diseasesFilterForm]',
  template: `
  @defer {
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
      <button type="button" color="secondary" mat-stroked-button (click)="service.downloadXLSX$(key(), 'Diseases')">Descargar</button>
    </mat-expansion-panel>
  </mat-accordion>
</form>
}
  }

  `,
  standalone: true,
  imports: [ FontAwesomeModule, CollapseModule,
    ControlSelectComponent, ModalModule, ControlsModule,
    CommonModule, CdkModule, MaterialModule, FormNewModule,
   ],
})
export class DiseasesFilterFormComponent extends FormComponent<DiseasesService> implements OnInit, FilterFormGroupActions<Disease, DiseaseParams, FormGroup2<DiseaseParams>> {
  item: InputSignal<Disease | undefined> = input.required();
  use: InputSignal<FormUse> = input.required();
  view: InputSignal<View> = input.required();
  key: InputSignal<string> = input.required();
  role: InputSignal<string> = input.required();
  formId: InputSignal<string> = input.required();
  mode: InputSignal<CatalogMode> = input.required();

  readonly toggle = model.required();

  private ngUnsubscribe = new Subject<void>();
  params!: DiseaseParams;
  info: FormInfo<DiseaseParams> = {
    description: { label: 'Descripción', placeholder: 'Descripción', type: 'textarea' },
    id: { label: 'Ganadería', placeholder: 'Ganadería', type: 'number', isDisabled: true },
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

  form: FormGroup2<DiseaseParams> = new FormGroup2<DiseaseParams>(DiseaseParams as any, new DiseaseParams(createId()), this.info, { orientation: 'inline', use: 'filter' });

  constructor() {
    super(DiseasesService);

    this.form.controls.sort.selectOptions = sortOptions;
    this.form.controls.sort.setValue(sortOptions[0]);

    effect(() => {
      this.params = new DiseaseParams(this.key());


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
    // this.service.submitForm(this.key(), result as DiseaseParams);
  }
}
