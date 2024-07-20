import { Component, inject, Input, input, OnDestroy, OnInit } from "@angular/core";
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
import { Order, OrderParams } from "src/app/_models/order";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { OrdersService } from "src/app/_services/orders.service";
import { ProductTableHasAccountCellComponent } from "src/app/products/components/product-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_orders', },
  selector: 'table[ordersTable]',
  standalone: true,
  templateUrl: './orders-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, DatePipe, MaterialModule, CdkModule, CurrencyPipe, ProductTableHasAccountCellComponent],
})
export class OrdersTableComponent implements OnInit, OnDestroy {
  service = inject(OrdersService);
  icons = inject(IconsService);

  @Input() data: Order[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: OrderParams;

  subscriptions: Subscription[] = [];

  cuid: string;

  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
