import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { CardIconComponent } from "src/app/_shared/components/payment-methods/card-icon/card-icon.component";
import { CardBrand } from "src/app/_shared/components/payment-methods/card-icon/cardBrand";
import { CardIconSize } from "src/app/_shared/components/payment-methods/card-icon/cardIconSize";

@Component({
  selector: 'div[paymentMethodDisplayCard]',
  templateUrl: './payment-method-display-card.component.html',
  styleUrl: './payment-method-display-card.component.scss',
  imports: [
    CardIconComponent
  ],
})
export class PaymentMethodDisplayCardComponent {
  protected readonly CardIconSize: typeof CardIconSize = CardIconSize;
  protected readonly CardBrand: typeof CardBrand = CardBrand;

  paymentMethod: InputSignal<PaymentMethod> = input.required();

  onMainPaymentMethodSelect: OutputEmitterRef<string> = output<string>();
  onPaymentMethodDelete: OutputEmitterRef<string> = output<string>();
}
