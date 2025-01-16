import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode, } from "src/app/_models/base/types";
import { Service } from "src/app/_models/services/service";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { ServicesTableComponent } from "src/app/services/components/services-table.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { ServicesService } from "src/app/services/services.config";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { FilterConfiguration } from "../../_models/base/filter-types";

@Component({
  selector: '[servicesCatalog]',
  templateUrl: './services-catalog.component.html',
  imports: [ ServicesTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule ],
  standalone: true,
})
export class ServicesCatalogComponent {
  item: ModelSignal<Service | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ServiceParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: ServicesService = inject(ServicesService);
  form = model(new ServiceFiltersForm());
}
