import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Order } from 'src/app/_models/orders/order';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeOrderCreateRoute]',
  template: `
    <div orderForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"></div>
  `,
  standalone: false,
})
export class HomeOrderCreateRouteComponent extends BaseRouteDetail<Order> {
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
