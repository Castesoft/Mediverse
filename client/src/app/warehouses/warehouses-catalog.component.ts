import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode,  } from "src/app/_models/base/types";
import { Warehouse } from "src/app/_models/warehouses/warehouse";
import { WarehouseParams } from "src/app/_models/warehouses/warehouseParams";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { WarehousesService } from "src/app/warehouses/warehouses.config";
import { WarehouseFiltersForm } from "src/app/_models/warehouses/warehouseFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { WarehousesTableComponent } from "src/app/warehouses/warehouses-table.component";
import { FilterConfiguration } from "src/app/_models/base/filter-types";

@Component({
  selector: '[warehousesCatalog]',
  templateUrl: './warehouses-catalog.component.html',
  imports: [ WarehousesTableComponent, FormsModule, ControlsRow3Component, ControlsWrapper3Component, GenericCatalogComponent ],
  standalone: true,
})
export class WarehousesCatalogComponent {
  item: ModelSignal<Warehouse | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<WarehouseParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: WarehousesService = inject(WarehousesService);
  form: ModelSignal<WarehouseFiltersForm> = model(new WarehouseFiltersForm());
}
