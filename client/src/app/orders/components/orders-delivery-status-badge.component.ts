import { Component, input, effect, InputSignal } from "@angular/core";
import { OrderDeliveryStatus } from "src/app/_models/orders/orderTypes";
import {
  getOrderDeliveryStatus,
  getOrderDeliveryStatusBadgeColor,
  parseOrderDeliveryStatusFromSelectOption
} from "src/app/orders/orders-util";
import { SelectOption } from "src/app/_models/base/selectOption";

@Component({
  selector: '[ordersDeliveryStatusBadge]',
  template: `
    <span
      [class.badge-lg]="size() === 'lg'"
      [class.badge-sm]="size() === 'sm'"
      class="badge badge-light-{{ statusClass }}"
    >
      {{ parsedStatus }}
    </span>`,
  standalone: true,
})
export class OrdersDeliveryStatusBadgeComponent {
  statusOption: InputSignal<SelectOption | null> = input.required<SelectOption | null>();
  size: InputSignal<"sm" | "lg" | undefined> = input<'sm' | 'lg'>();

  parsedStatus: string = '';
  statusClass: string = '';

  constructor() {
    effect((): void => {
      const status: OrderDeliveryStatus | null = parseOrderDeliveryStatusFromSelectOption(this.statusOption());
      if (!status) {
        console.error('Invalid OrderDeliveryStatus');
        return;
      }

      this.parsedStatus = getOrderDeliveryStatus(status);
      this.statusClass = getOrderDeliveryStatusBadgeColor(status);
    });
  }
}

