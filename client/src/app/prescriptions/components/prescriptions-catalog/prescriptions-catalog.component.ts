import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, ModelSignal, model, input, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { PrescriptionsTableComponent } from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescriptions-table.component";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.config";

@Component({
  selector: '[prescriptionsCatalog]',
  template: ``,
  // templateUrl: './prescriptions-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    PrescriptionsTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class PrescriptionsCatalogComponent
  extends BaseCatalog<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService>
  implements OnInit, OnDestroy, CatalogInputSignals<Prescription, PrescriptionParams>
{
  item: ModelSignal<Prescription | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PrescriptionParams> = model.required();

  animalId = input<number>();

  constructor() {
    super(PrescriptionsService, PrescriptionFiltersForm);

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
