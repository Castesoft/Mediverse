import { LayoutModule } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, effect, model, ModelSignal, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ControlsModule } from "src/app/_forms/controls.module";
import { View, CatalogMode } from "src/app/_models/base/types";
import { BaseCatalog } from "src/app/_models/forms/extensions/baseFormComponent";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { CatalogModule } from "src/app/_shared/catalog.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { PrescriptionsTableComponent } from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescriptions-table.component";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.config";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[prescriptionsCatalog]',
  templateUrl: 'prescriptions-catalog.component.html',
  standalone: true,
  imports: [
    BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, CommonModule,
    AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, LayoutModule, PrescriptionsTableComponent
  ]
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
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
