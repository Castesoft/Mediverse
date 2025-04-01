import { Component, inject, input, InputSignal } from '@angular/core';
import { PaymentConfirmationMethod } from "src/app/events/components/event-payment-modal/paymentConfirmationMethod";
import { IconsService } from "src/app/_services/icons.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'div[nonLinkedPaymentMethodCell]',
  templateUrl: './non-linked-payment-method-cell.component.html',
  styleUrl: './non-linked-payment-method-cell.component.scss',
  imports: [
    FaIconComponent
  ]
})
export class NonLinkedPaymentMethodCellComponent {
  protected readonly PaymentConfirmationMethod: typeof PaymentConfirmationMethod = PaymentConfirmationMethod;

  readonly iconsService: IconsService = inject(IconsService);

  nonLinkedPaymentMethod: InputSignal<PaymentConfirmationMethod> = input.required();
}
