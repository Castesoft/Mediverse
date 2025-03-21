import { Component, inject, model, ModelSignal } from "@angular/core";
import { CatalogMode, View, } from "src/app/_models/base/types";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import {
  PrescriptionsTableComponent
} from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescriptions-table.component";
import { FilterConfiguration } from "src/app/_models/base/filter-types";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  CatalogLayoutSkeletonComponent
} from "src/app/_shared/components/catalog-layout-skeleton/catalog-layout-skeleton.component";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.service";

@Component({
  selector: '[prescriptionsCatalog]',
  templateUrl: './prescriptions-catalog.component.html',
  imports: [ PrescriptionsTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule, PrescriptionsTableComponent, MatProgressBarModule, CatalogLayoutSkeletonComponent, ],
  standalone: true,
})
export class PrescriptionsCatalogComponent {
  item: ModelSignal<Prescription | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PrescriptionParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: PrescriptionsService = inject(PrescriptionsService);
  form: ModelSignal<PrescriptionFiltersForm> = model(new PrescriptionFiltersForm());
}
