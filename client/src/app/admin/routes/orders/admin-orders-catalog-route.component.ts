import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Order } from "src/app/_models/orders/order";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { OrdersService } from "src/app/orders/orders.config";
import { SiteSection } from "../../../_models/sections/sectionTypes";

@Component({
  selector: 'div[adminOrdersCatalogRoute]',
  templateUrl: './admin-orders-catalog-route.component.html',
  standalone: false,
})
export class AdminOrdersCatalogRouteComponent extends BaseRouteCatalog<Order, OrderParams, OrderFiltersForm, OrdersService> {
  constructor() {
    super(OrdersService, 'orders');
    this.params().fromSection = SiteSection.ADMIN
  }
}
