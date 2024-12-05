import { Component, inject, Input, input, model, OnDestroy, OnInit } from "@angular/core";
import { CatalogMode } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { OrderParams } from "../_models/orders/orderParams";
import { Order } from "../_models/orders/order";
import { Subscription } from "rxjs";
import { OrdersService } from "src/app/_services/orders.service";
import { ProductTableHasAccountCellComponent } from "src/app/products/components/product-table-cell.component";
import { PatientSummaryCardComponent } from "src/app/patients/patient-summary-card.component";
import { PatientSelectDisplayCardComponent } from "src/app/patients/patient-select-display-card.component";
import { PatientTableCellComponent } from "src/app/_shared/components/patient-table-cell.component";
import { OrdersDeliveryStatusBadgeComponent } from "src/app/orders/components/orders-deilvery-status-badge.component";
import { OrdersStatusBadgeComponent } from "src/app/orders/components/orders-status-badge.component";
import { createId } from "@paralleldrive/cuid2";

@Component({
  selector: 'table[ordersTable]',
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_orders', },
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, DatePipe, MaterialModule, CdkModule, CurrencyPipe, ProductTableHasAccountCellComponent, PatientSummaryCardComponent, PatientSelectDisplayCardComponent, PatientTableCellComponent, OrdersDeliveryStatusBadgeComponent, OrdersStatusBadgeComponent],
  standalone: true,
})
export class OrdersTableComponent implements OnInit, OnDestroy {
  service = inject(OrdersService);
  icons = inject(IconsService);

  @Input() data: Order[] = [];
  key = model.required<string>();
  mode = model.required<CatalogMode>();
  showHeaders = input<boolean>(true);

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: OrderParams;

  subscriptions: Subscription[] = [];

  cuid: string = createId();

  constructor() {}

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
