import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { SubscriptionParams } from "src/app/_models/subscriptions/subscriptionParams";
import { SubscriptionFiltersForm } from "src/app/_models/subscriptions/subscriptionFiltersForm";
import { SubscriptionsService } from "src/app/subscriptions/subscription.config";

@Component({
  selector: 'div[adminSubscriptionsCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div subscriptionsCatalog [(item)]="item" [(isCompact)]="compact.isCompact" [(key)]="key" [(mode)]="mode"
           [(params)]="params" [(view)]="view"></div>
    </div>
  `,
  standalone: false,
})
export class AdminSubscriptionsCatalogRouteComponent extends BaseRouteCatalog<Subscription, SubscriptionParams, SubscriptionFiltersForm, SubscriptionsService> {
  constructor() {
    super(SubscriptionsService, 'subscriptions');
    this.params().fromSection = SiteSection.ADMIN
  }
}
