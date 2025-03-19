import { Component, model, ModelSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { Payment } from '../_models/payments/payment';
import { PaymentParams } from '../_models/payments/paymentParams';
import { PaymentFiltersForm } from 'src/app/_models/payments/paymentFiltersForm';
import { PaymentsService } from 'src/app/payments/payments.config';
import { paymentCells } from 'src/app/_models/payments/paymentConstants';
import { TableMenuComponent } from 'src/app/_shared/components/table-menu.component';
import { PaymentStatusCellComponent } from "src/app/payments/components/payment-status-cell.component";
import { PaymentMethodCellComponent } from "src/app/payments/components/payment-method-cell.component";
import { EventTableCellComponent } from "src/app/events/components/event-table-cell/event-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[paymentsTable]',
  standalone: true,
  templateUrl: './payments-table.component.html',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    ControlsModule,
    CdkModule,
    MaterialModule,
    TablesModule,
    TableMenuComponent,
    PaymentMethodCellComponent,
    PaymentStatusCellComponent,
    EventTableCellComponent,
  ]
})
export class PaymentsTableComponent extends BaseTable<Payment, PaymentParams, PaymentFiltersForm, PaymentsService>
  implements TableInputSignals<Payment, PaymentParams> {

  item: ModelSignal<Payment | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PaymentParams> = model.required();
  data: ModelSignal<Payment[]> = model.required();

  constructor() {
    super(PaymentsService, Payment, { tableCells: paymentCells });
  }
}
