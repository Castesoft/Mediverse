import { Component, inject, model, ModelSignal } from '@angular/core';
import { GenericCatalogComponent } from 'src/app/_shared/components/catalog-layout.component';
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { CatalogMode, View } from "src/app/_models/base/types";
import { SubscriptionParams } from "src/app/_models/subscriptions/subscriptionParams";
import { FilterConfiguration } from "src/app/_models/base/filter-types";
import { SubscriptionFiltersForm } from "src/app/_models/subscriptions/subscriptionFiltersForm";
import { SubscriptionsService } from "src/app/subscriptions/subscription.config";
import { SubscriptionsTableComponent } from "src/app/subscriptions/subscriptions-table.component";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: '[subscriptionsCatalog]',
  templateUrl: './subscriptions-catalog.component.html',
  imports: [ SubscriptionsTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule ],
  standalone: true,
})
export class SubscriptionsCatalogComponent {
  item: ModelSignal<Subscription | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<SubscriptionParams> = model.required();
  embedded: ModelSignal<boolean> = model(false);
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: SubscriptionsService = inject(SubscriptionsService);
  form: ModelSignal<SubscriptionFiltersForm> = model(new SubscriptionFiltersForm());
}
