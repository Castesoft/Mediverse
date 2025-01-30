import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode,  } from "src/app/_models/base/types";
import { Order } from "src/app/_models/orders/order";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { OrdersService } from "src/app/orders/orders.config";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { OrdersTableComponent } from "src/app/orders/orders-table.component";
import { FilterConfiguration } from "../_models/base/filter-types";

@Component({
  selector: '[ordersCatalog]',
  templateUrl: './orders-catalog.component.html',
  imports: [ OrdersTableComponent, FormsModule, ControlsRow3Component, ControlsWrapper3Component, GenericCatalogComponent ],
  standalone: true,
})
export class OrdersCatalogComponent {
  item: ModelSignal<Order | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<OrderParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: OrdersService = inject(OrdersService);
  form: ModelSignal<OrderFiltersForm> = model(new OrderFiltersForm());
}
