import { Component, effect, input, InputSignal } from '@angular/core';
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { CardIconComponent } from "src/app/_shared/components/payment-methods/card-icon/card-icon.component";
import { CardBrand } from "src/app/_shared/components/payment-methods/card-icon/cardBrand";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { NgClass } from "@angular/common";

@Component({
  selector: 'div[paymentMethodCell]',
  imports: [ CardIconComponent, TooltipDirective, NgClass ],
  templateUrl: './payment-method-cell.component.html',
  styleUrl: './payment-method-cell.component.scss'
})
export class PaymentMethodCellComponent {
  protected readonly CardBrand: typeof CardBrand = CardBrand;

  paymentMethod: InputSignal<Partial<PaymentMethod> | PaymentMethod> = input.required();
  justify: InputSignal<'start' | 'center' | 'end'> = input('start' as any);

  tooltipText: string = '';

  constructor() {
    effect(() => {
      const { brand, last4, funding } = this.paymentMethod();

      let translatedFunding: string = '';

      switch (funding) {
        case 'credit':
          translatedFunding = 'crédito';
          break;
        case 'debit':
          translatedFunding = 'débito';
          break;
        case 'prepaid':
          translatedFunding = 'prepago';
          break;
      }

      this.tooltipText = `${brand} con terminación ${last4}`;
      if (translatedFunding) this.tooltipText += ` (${translatedFunding})`;
    });
  }
}
