import { Component, inject, model, ModelSignal } from '@angular/core';
import { GenericCatalogComponent } from 'src/app/_shared/components/catalog-layout.component';
import { Payment } from "src/app/_models/payments/payment";
import { CatalogMode, View } from "src/app/_models/base/types";
import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { FilterConfiguration } from "src/app/_models/base/filter-types";
import { PaymentFiltersForm } from "src/app/_models/payments/paymentFiltersForm";
import { PaymentsService } from "src/app/payments/payments.config";
import { PaymentsTableComponent } from "src/app/payments/payments-table.component";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: '[paymentsCatalog]',
  templateUrl: './payments-catalog.component.html',
  imports: [ PaymentsTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule ],
  standalone: true,
})
export class PaymentsCatalogComponent {
  item: ModelSignal<Payment | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PaymentParams> = model.required();
  embedded: ModelSignal<boolean> = model(false);
  useCard: ModelSignal<boolean> = model(true);
  title: ModelSignal<string | undefined> = model();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: PaymentsService = inject(PaymentsService);
  form: ModelSignal<PaymentFiltersForm> = model(new PaymentFiltersForm());
}
