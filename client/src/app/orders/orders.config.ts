import { Injectable } from "@angular/core";
import { Order } from "src/app/_models/orders/order";
import { orderColumns, orderDictionary } from "src/app/_models/orders/orderConstants";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends ServiceHelper<Order, OrderParams, OrderFiltersForm> {
  constructor() {
    super(OrderParams, 'orders', orderDictionary, orderColumns);
  }
}
