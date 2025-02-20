import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import { CardIconComponent } from 'src/app/_shared/components/payment-methods/card-icon/card-icon.component';
import { CardBrand } from 'src/app/_shared/components/payment-methods/card-icon/cardBrand';
import { CardIconSize } from 'src/app/_shared/components/payment-methods/card-icon/cardIconSize';

@Component({
  selector: 'div[paymentMethodDisplayCard]',
  templateUrl: './payment-method-display-card.component.html',
  styleUrls: [ './payment-method-display-card.component.scss' ],
  imports: [ CardIconComponent ],
  standalone: true
})
export class PaymentMethodDisplayCardComponent {
  protected readonly CardIconSize: typeof CardIconSize = CardIconSize;
  protected readonly CardBrand: typeof CardBrand = CardBrand;

  paymentMethod: InputSignal<PaymentMethod> = input.required();
  selected: InputSignal<boolean> = input(false);
  displayOnly: InputSignal<boolean> = input(false);
  selectionMode: InputSignal<boolean> = input(false);

  onMainPaymentMethodSelect: OutputEmitterRef<string> = output();
  onPaymentMethodDelete: OutputEmitterRef<string> = output();
  onSelect: OutputEmitterRef<string> = output();

  onRadioChange(): void {
    this.onSelect.emit(this.paymentMethod().stripePaymentMethodId!);
  }
}
