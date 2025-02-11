import { Component, inject, model, ModelSignal } from '@angular/core';
import { GenericCatalogComponent } from 'src/app/_shared/components/catalog-layout.component';
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { CatalogMode, View } from "src/app/_models/base/types";
import { SubscriptionHistoryParams } from "src/app/_models/subscriptionHistories/subscriptionHistoryParams";
import { FilterConfiguration } from "src/app/_models/base/filter-types";
import { SubscriptionHistoryFiltersForm } from "src/app/_models/subscriptionHistories/subscriptionHistoryFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import {
  SubscriptionHistoriesTableComponent
} from "src/app/subscriptionHistories/subscriptionHistories-table.component";
import { SubscriptionHistoriesService } from "src/app/subscriptionHistories/subscriptionHistory.config";

@Component({
  selector: '[subscriptionHistoriesCatalog]',
  templateUrl: './subscriptionHistories-catalog.component.html',
  imports: [ SubscriptionHistoriesTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule ],
  standalone: true,
})
export class SubscriptionHistoryHistoriesCatalogComponent {
  item: ModelSignal<SubscriptionHistory | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<SubscriptionHistoryParams> = model.required();
  embedded: ModelSignal<boolean> = model(false);
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: SubscriptionHistoriesService = inject(SubscriptionHistoriesService);
  form: ModelSignal<SubscriptionHistoryFiltersForm> = model(new SubscriptionHistoryFiltersForm());
}
