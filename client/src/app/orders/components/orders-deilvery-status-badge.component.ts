import { Component, input, effect } from "@angular/core";
import { OrderDeliveryStatus } from "src/app/_models/orders/orderTypes";
import { parseOrderDeliveryStatus, parseOrderDeliveryStatusBadgeColor } from "src/app/orders/orders-util";

@Component({
  selector: '[ordersDeliveryStatusBadge]',
  template: `
    <span
      [class.badge-lg]="size() === 'lg'"
      [class.badge-sm]="size() === 'sm'"
      class="badge badge-{{ statusClass }}"
    >
    {{ parsedStatus }}
  </span>`,
  standalone: true,
})
export class OrdersDeliveryStatusBadgeComponent {
  status = input<OrderDeliveryStatus>();
  size = input<'sm' | 'lg'>();

  parsedStatus: string = '';
  statusClass: string = '';

  constructor() {
    effect(() => {
      this.parsedStatus = parseOrderDeliveryStatus(this.status()!);
      this.statusClass = parseOrderDeliveryStatusBadgeColor(this.status()!);
    });
  }
}

