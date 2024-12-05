import { Component, input, effect } from "@angular/core";
import { OrderStatus } from "src/app/_models/orders/orderTypes";
import { parseOrderStatus, parseOrderStatusBadgeColor } from "src/app/orders/orders-util";

@Component({
  selector: '[ordersStatusBadge]',
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
export class OrdersStatusBadgeComponent {
  status = input<OrderStatus>();
  size = input<'sm' | 'lg'>();

  parsedStatus: string = '';
  statusClass: string = '';

  constructor() {
    effect(() => {
      this.parsedStatus = parseOrderStatus(this.status()!);
      this.statusClass = parseOrderStatusBadgeColor(this.status()!);
    });
  }
}
