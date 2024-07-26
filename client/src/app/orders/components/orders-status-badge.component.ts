import { Component, input, OnInit } from "@angular/core";
import { OrderStatus } from "src/app/_models/order";
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
export class OrdersStatusBadgeComponent implements OnInit {
  status = input<OrderStatus>();
  size = input<'sm' | 'lg'>();

  parsedStatus: string = '';
  statusClass: string = '';

  ngOnInit(): void {
    console.log(this.status())

    this.parsedStatus = parseOrderStatus(this.status()!);
    this.statusClass = parseOrderStatusBadgeColor(this.status()!);
  }
}
