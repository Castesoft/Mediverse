import { CommonModule } from '@angular/common';
import { Component, OnInit, ModelSignal, model, OnDestroy, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { View, CatalogMode } from 'src/app/_models/base/types';
import { Order } from 'src/app/_models/orders/order';
import { orderCells } from 'src/app/_models/orders/orderConstants';
import { OrderFiltersForm } from 'src/app/_models/orders/orderFiltersForm';
import { OrderParams } from 'src/app/_models/orders/orderParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { OrdersService } from 'src/app/orders/orders.config';
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[ordersTable]',
  templateUrl: './orders-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    TableMenuComponent,
  ],
})
export class OrdersTableComponent
  extends BaseTable<Order, OrderParams, OrderFiltersForm, OrdersService>
  implements OnInit, OnDestroy, TableInputSignals<Order, OrderParams> {
  item: ModelSignal<Order | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<OrderParams> = model.required();
  data: ModelSignal<Order[]> = model.required();

  constructor() {
    super(OrdersService, Order, { tableCells: orderCells, });

    effect(() => {});
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
