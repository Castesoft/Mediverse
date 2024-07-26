import { Component, input, OnInit } from "@angular/core";
import { OrderDeliveryStatus } from "src/app/_models/order";
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
export class OrdersDeliveryStatusBadgeComponent implements OnInit {
  status = input<OrderDeliveryStatus>();
  size = input<'sm' | 'lg'>();

  parsedStatus: string = '';
  statusClass: string = '';

  ngOnInit(): void {
    this.parsedStatus = parseOrderDeliveryStatus(this.status()!);
    this.statusClass = parseOrderDeliveryStatusBadgeColor(this.status()!);
  }
}

