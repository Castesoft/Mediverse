import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode,  } from "src/app/_models/base/types";
import { Doctor } from "src/app/_models/doctors/doctor";
import { DoctorParams } from "src/app/_models/doctors/doctorParams";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { DoctorsService } from "src/app/doctors/doctors.config";
import { DoctorFiltersForm } from "src/app/_models/doctors/doctorFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { DoctorsTableComponent } from "src/app/doctors/doctors-table.component";
import { FilterConfiguration } from "../_models/base/filter-types";

@Component({
  selector: '[doctorsCatalog]',
  templateUrl: './doctors-catalog.component.html',
  imports: [ DoctorsTableComponent, FormsModule, ControlsRow3Component, ControlsWrapper3Component, GenericCatalogComponent ],
  standalone: true,
})
export class DoctorsCatalogComponent {
  item: ModelSignal<Doctor | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<DoctorParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: DoctorsService = inject(DoctorsService);
  form = model(new DoctorFiltersForm());
}
