import { Component, ModelSignal, model, inject, signal } from "@angular/core";
import { View, CatalogMode,  } from "src/app/_models/base/types";
import { Patient } from "src/app/_models/patients/patient";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { PatientsTableComponent } from "src/app/patients/components/patients-table.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { PatientsService } from "src/app/patients/patients.config";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FilterConfiguration } from "../../_models/base/filter-types";

@Component({
  selector: '[patientsCatalog]',
  templateUrl: './patients-catalog.component.html',
  imports: [ PatientsTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component ],
  standalone: true,
})
export class PatientsCatalogComponent {
  item: ModelSignal<Patient | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PatientParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: PatientsService = inject(PatientsService);
  form = model(new PatientFiltersForm());
}
