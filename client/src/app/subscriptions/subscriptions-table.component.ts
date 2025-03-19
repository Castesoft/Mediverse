import { CommonModule } from "@angular/common";
import { Component, ModelSignal, model, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { Subscription } from "../_models/subscriptions/subscription";
import { SubscriptionParams } from "../_models/subscriptions/subscriptionParams";
import { SubscriptionFiltersForm } from "src/app/_models/subscriptions/subscriptionFiltersForm";
import { SubscriptionsService } from "src/app/subscriptions/subscription.config";
import { subscriptionCells } from "src/app/_models/subscriptions/subscriptionConstants";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import {
  SubscriptionStatusCellComponent
} from "src/app/_shared/template/components/tables/cells/subscription-status-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[subscriptionsTable]',
  templateUrl: './subscriptions-table.component.html',
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
    SubscriptionStatusCellComponent,
  ],
})
export class SubscriptionsTableComponent extends BaseTable<Subscription, SubscriptionParams, SubscriptionFiltersForm, SubscriptionsService> implements TableInputSignals<Subscription, SubscriptionParams> {
  item: ModelSignal<Subscription | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<SubscriptionParams> = model.required();
  data: ModelSignal<Subscription[]> = model.required();

  constructor() {
    super(SubscriptionsService, Subscription, { tableCells: subscriptionCells, });
  }
}
