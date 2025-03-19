import { Component, effect, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CurrencyPipe } from "@angular/common";
import { PaymentCalculationService } from "src/app/payment-checkout/payment-calculation.service";
import {
  PaymentDisclaimerComponent
} from "src/app/payment-checkout/components/subscription-terms-and-conditions-disclaimer-notice/payment-disclaimer.component";
import {
  OrderProductsTableComponent
} from "src/app/orders/components/order-products-table/order-products-table.component";
import { ToastrService } from "ngx-toastr";
import Event from "src/app/_models/events/event";
import { Order } from "src/app/_models/orders/order";

@Component({
  selector: 'div[paymentSummary]',
  templateUrl: './payment-summary.component.html',
  imports: [
    CurrencyPipe,
    PaymentDisclaimerComponent,
    OrderProductsTableComponent
  ],
  styleUrls: [ './payment-summary.component.scss' ]
})
export class PaymentSummaryComponent {
  private readonly calcService: PaymentCalculationService = inject(PaymentCalculationService);
  private readonly toastr: ToastrService = inject(ToastrService);

  subtotal: InputSignal<number> = input.required();
  discount: InputSignal<number> = input(0);

  item: InputSignal<Event | Order | null> = input.required();
  type: InputSignal<'cita' | 'receta' | 'medicamentos' | 'suscripcion'> = input('cita' as any);
  isSubmitting: InputSignal<boolean> = input(false);

  onPay: OutputEmitterRef<void> = output();

  tax: number = 0;
  total: number = 0;

  constructor() {
    effect(() => {
      this.calculateTotals();
    })
  }

  private calculateTotals(): void {
    this.tax = this.calcService.calculateTax(this.subtotal(), this.discount());
    this.total = this.calcService.calculateTotal(this.subtotal(), this.discount());
  }

  onApplyPromoCode(): void {
    this.toastr.error('El código promocional no es válido');
  }
}
