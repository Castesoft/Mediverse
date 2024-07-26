import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Product } from 'src/app/_models/product';

@Component({
  selector: 'order-products-summary, tr[orderProductsSummary]',
  template: `
    <td>
      <p class="fs-5 fw-semibold mb-0">
        {{ item().name }} {{ item().dosage }} {{ item().unit }}
      </p>
    </td>
    <td class="text-end">
      {{ item().price | currency }}
    </td>
    <td class="text-end">
      {{ item().quantity }}
    </td>
    <td class="fw-bold text-end">
      {{ (item().price * item().quantity) | currency }}
    </td>
  `,
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe,]
})
export class OrderProductsSummaryComponent {
  item = input.required<Product>();
}
