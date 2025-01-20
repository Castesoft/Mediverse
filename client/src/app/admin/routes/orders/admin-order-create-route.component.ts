import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Order } from 'src/app/_models/orders/order';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[adminOrderCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div orderForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminOrderCreateRouteComponent extends BaseRouteDetail<Order> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;

  constructor() {
    super('orders', FormUse.CREATE);

    this.key.set(`${this.router.url}#order-create`);

    effect(() => {
      const navigation: Navigation | null = this.router.getCurrentNavigation();
      if (navigation !== null) {
        this.key.set(navigation?.extras?.state?.['key'] || null);
      }
    });
  }
}
