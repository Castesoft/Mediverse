import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getPaymentStatusText, PaymentStatus } from 'src/app/_models/payments/paymentConstants';

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'payment-status-badge',
  templateUrl: './payment-status-badge.component.html',
  imports: [ CommonModule ],
})
export class PaymentStatusBadgeComponent {
  paymentStatus: InputSignal<string | null> = input.required();

  protected readonly PaymentStatus: typeof PaymentStatus = PaymentStatus;
  public readonly paymentStatusText = getPaymentStatusText;

  public paymentStatusBadgeClass(status: string | null): string {
    switch (status) {
      case PaymentStatus.Succeeded:
        return 'badge bg-success text-white';
      case PaymentStatus.AwaitingPayment:
        return 'badge bg-warning text-dark';
      case PaymentStatus.Canceled:
        return 'badge bg-danger text-white';
      case PaymentStatus.Refunded:
        return 'badge bg-info text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }
}
