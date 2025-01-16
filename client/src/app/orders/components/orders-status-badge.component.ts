import { Component, input, effect, InputSignal } from "@angular/core";
import { OrderStatus } from "src/app/_models/orders/orderTypes";
import {
  getOrderStatus,
  getOrderStatusBadgeColor,
  parseOrderStatusFromSelectOption
} from "src/app/orders/orders-util";
import { SelectOption } from "src/app/_models/base/selectOption";

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
  statusOption: InputSignal<SelectOption | null> = input.required<SelectOption | null>();
  size: InputSignal<"sm" | "lg" | undefined> = input<'sm' | 'lg'>();

  parsedStatus: string = '';
  statusClass: string = '';

  constructor() {
    effect((): void => {
      const status: OrderStatus | null = parseOrderStatusFromSelectOption(this.statusOption());
      if (!status) {
        console.error('Invalid OrderStatus');
        return;
      }

      this.parsedStatus = getOrderStatus(status);
      this.statusClass = getOrderStatusBadgeColor(status);
    });
  }
}

