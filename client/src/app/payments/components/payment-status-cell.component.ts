import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'div[paymentStatusCell]',
  template: `
    <span class="badge" [ngClass]="badgeClass">
      {{ translatedStatus }}
    </span>
  `,
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
      case 'Canceled':
        return 'badge-light-danger';
      default:
        return 'badge-light-warning';
    }
  }

  get translatedStatus(): string {
    switch (this.status()) {
      case 'RequiresPaymentMethod':
        return 'Requiere método de pago';
      case 'RequiresConfirmation':
        return 'Requiere confirmación';
      case 'RequiresAction':
        return 'Requiere acción';
      case 'Processing':
        return 'Procesando';
      case 'RequiresCapture':
        return 'Requiere captura';
      case 'Succeeded':
        return 'Completado';
      case 'Canceled':
        return 'Cancelado';
      case 'Refunded':
        return 'Reembolsado';
      default:
        return this.status();
    }
  }
}
