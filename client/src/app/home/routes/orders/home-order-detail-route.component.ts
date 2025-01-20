import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Order } from 'src/app/_models/orders/order';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: 'div[homeOrderDetailRoute]',
  template: `
    <div orderForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"></div>
  `,
  standalone: false,
})
export class HomeOrderDetailRouteComponent extends BaseRouteDetail<Order> {
  constructor() {
    super('orders', FormUse.DETAIL);

    this.key.set(`${this.router.url}#order-detail`);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}
