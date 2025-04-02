import { Component, effect, input, InputSignal } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  selector: 'div[nonLinkedPaymentMethodCell]',
  templateUrl: './non-linked-payment-method-cell.component.html',
  styleUrl: './non-linked-payment-method-cell.component.scss',
  imports: [
    FaIconComponent
  ]
})
export class NonLinkedPaymentMethodCellComponent {
  paymentMethodType: InputSignal<PaymentMethodType> = input.required();

  constructor(private readonly iconsService: IconsService) {
    this.iconsService.loadIcons();
  }
}
