import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode, FilterOrientation, FilterConfiguration } from "src/app/_models/base/types";
import { NurseParams } from "src/app/_models/nurses/nurseParams";
import { NursesTableComponent } from "src/app/nurses/components/nurses-table.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { NursesService } from "src/app/nurses/nurses.config";
import { NurseFiltersForm } from "src/app/_models/nurses/nurseFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import Nurse from "src/app/_models/nurses/nurse";

@Component({
  selector: '[nursesCatalog]',
  templateUrl: './nurses-catalog.component.html',
  imports: [ NursesTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule ],
  standalone: true,
})
export class NursesCatalogComponent {
  item: ModelSignal<Nurse | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<NurseParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: NursesService = inject(NursesService);
  form = model(new NurseFiltersForm());
}
