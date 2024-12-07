import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy, inject, input, model, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Subject } from "rxjs";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Order } from "src/app/_models/orders/order";
import { orderCells } from "src/app/_models/orders/orderConstants";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { PartialCellsOf } from "src/app/_models/tables/tableCellItem";
import { TableRow } from "src/app/_models/tables/tableRow";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { PatientTableCellComponent } from "src/app/_shared/components/patient-table-cell.component";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { OrdersDeliveryStatusBadgeComponent } from "src/app/orders/components/orders-deilvery-status-badge.component";
import { OrdersStatusBadgeComponent } from "src/app/orders/components/orders-status-badge.component";
import { OrdersService } from "src/app/orders/orders.config";
import { PatientSelectDisplayCardComponent } from "src/app/patients/patient-select-display-card.component";
import { PatientSummaryCardComponent } from "src/app/patients/patient-summary-card.component";

@Component({
  selector: 'table[ordersTable]',
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_orders', },
  // templateUrl: './orders-table.component.html',
  template: ``,
  styleUrls: ['./orders-table.component.scss'],
  imports: [FontAwesomeModule, TableHeaderComponent, CommonModule, FormsModule, RouterModule, BsDropdownModule, MaterialModule, CdkModule, PatientSummaryCardComponent, PatientSelectDisplayCardComponent, PatientTableCellComponent, OrdersDeliveryStatusBadgeComponent, OrdersStatusBadgeComponent],
  standalone: true,
})
export class OrdersTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(OrdersService);
  icons = inject(IconsService);
  dev = inject(DevService);

  data = input.required<Order[]>();
  isCompact = model.required<boolean>();
  mode = model.required<CatalogMode>();
  key = model.required<string | null>();
  view = model.required<View>();

  sortAscending = false;
  params!: OrderParams;
  cuid = createId();
  selected = false;
  row: TableRow<Order> = new TableRow<Order>(new Order());

  cells: PartialCellsOf<Order> = orderCells;

  constructor() {
    effect(() => {
      this.params = new OrderParams(this.key());
      this.service.param$(this.key(), this.mode()).subscribe({
        next: (params) => {
          this.params = params;
        },
      });
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
