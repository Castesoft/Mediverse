import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'div[paymentStatusCell]',
  templateUrl: './payment-status-cell.component.html',
  standalone: true,
  imports: [ NgClass ],
})
export class PaymentStatusCellComponent {
  status: InputSignal<string> = input("");

  get badgeClass(): string {
    switch (this.status()) {
      case 'Succeeded':
        return 'badge-light-success';
      case 'Processing':
        return 'badge-light-primary';
      default:
        return 'badge-light-warning';
    }
  }
}
