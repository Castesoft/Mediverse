import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode, FilterOrientation, FilterConfiguration } from "src/app/_models/base/types";
import { ClinicsTableComponent } from "src/app/clinics/components/clinics-table.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { ClinicsService } from "src/app/clinics/clinics.config";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import Clinic from "src/app/_models/clinics/clinic";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import ClinicFiltersForm from "src/app/_models/clinics/clinicFiltersForm";

@Component({
  selector: '[clinicsCatalog]',
  templateUrl: './clinics-catalog.component.html',
  imports: [ ClinicsTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule ],
  standalone: true,
})
export class ClinicsCatalogComponent {
  item: ModelSignal<Clinic | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ClinicParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: ClinicsService = inject(ClinicsService);
  form = model(new ClinicFiltersForm());
}
