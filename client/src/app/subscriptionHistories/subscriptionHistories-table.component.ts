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
import { SubscriptionHistoryParams } from "src/app/_models/subscriptionHistories/subscriptionHistoryParams";
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { SubscriptionHistoryFiltersForm } from "src/app/_models/subscriptionHistories/subscriptionHistoryFiltersForm";
import { SubscriptionHistoriesService } from "src/app/subscriptionHistories/subscriptionHistory.config";
import { subscriptionHistoryCells } from "src/app/_models/subscriptionHistories/subscriptionHistoryConstants";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[subscriptionHistoriesTable]',
  templateUrl: './subscriptionHistories-table.component.html',
  styleUrls: [ './subscriptionHistories-table.component.scss' ],
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
export class SubscriptionHistoriesTableComponent extends BaseTable<SubscriptionHistory, SubscriptionHistoryParams, SubscriptionHistoryFiltersForm, SubscriptionHistoriesService> implements TableInputSignals<SubscriptionHistory, SubscriptionHistoryParams> {
  item: ModelSignal<SubscriptionHistory | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<SubscriptionHistoryParams> = model.required();
  data: ModelSignal<SubscriptionHistory[]> = model.required();

  constructor() {
    super(SubscriptionHistoriesService, SubscriptionHistory, { tableCells: subscriptionHistoryCells, });
  }
}
