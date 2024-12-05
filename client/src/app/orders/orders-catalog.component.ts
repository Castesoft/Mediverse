import { LayoutModule } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject, model, ModelSignal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ControlsModule } from "src/app/_forms/controls.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import { BaseCatalog } from "src/app/_models/forms/extensions/baseFormComponent";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { Order } from "src/app/_models/orders/order";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { IconsService } from "src/app/_services/icons.service";
import { CatalogModule } from "src/app/_shared/catalog.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { OrdersTableComponent } from "src/app/orders/orders-table.component";
import { OrdersService } from "src/app/orders/orders.config";
import { ProductsTableComponent } from "src/app/products/components/products-table.component";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[ordersCatalog]',
  templateUrl: './orders-catalog.component.html',
  standalone: true,
  imports: [BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, CommonModule, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, LayoutModule, OrdersTableComponent, ProductsTableComponent, OrdersTableComponent
  ],
})
export class OrdersCatalogComponent
  extends BaseCatalog<Order, OrderParams, OrderFiltersForm, OrdersService>
  implements OnInit, OnDestroy, CatalogInputSignals<Order, OrderParams>
{
  item: ModelSignal<Order | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<OrderParams> = model.required();

  icons = inject(IconsService);

  data?: Order[];
  loading = true;

  constructor() {
    super(OrdersService, OrderFiltersForm);
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
