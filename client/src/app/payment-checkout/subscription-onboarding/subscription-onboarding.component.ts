import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  CheckoutAddressEntryCardComponent
} from 'src/app/payment-checkout/components/checkout-address-entry-card/checkout-address-entry-card.component';
import {
  CheckoutPaymentMethodEntryCardComponent
} from 'src/app/payment-checkout/components/checkout-payment-method-entry-card/checkout-payment-method-entry-card.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Address } from 'src/app/_models/addresses/address';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import { PaymentCheckoutService } from 'src/app/payment-checkout/payment-checkout.service';
import {
  PaymentDisclaimerComponent
} from "src/app/payment-checkout/components/subscription-terms-and-conditions-disclaimer-notice/payment-disclaimer.component";
import { CurrencyPipe } from "@angular/common";
import { StripeGatewayService } from "src/app/_services/stripe-gateway.service";
import { ErrorsAlert3Component } from "src/app/_forms2/helper/errors-alert-3.component";
import { BadRequest } from "src/app/_models/forms/badRequest";

@Component({
  selector: 'div[subscriptionOnboarding]',
  templateUrl: './subscription-onboarding.component.html',
  styleUrls: [ './subscription-onboarding.component.scss' ],
  imports: [
    CheckoutAddressEntryCardComponent,
    CheckoutPaymentMethodEntryCardComponent,
    PaymentDisclaimerComponent,
    CurrencyPipe,
    ErrorsAlert3Component
  ],
})
export class SubscriptionOnboardingComponent implements OnInit, OnDestroy {
  private readonly paymentGatewayService: StripeGatewayService = inject(StripeGatewayService);
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly destroy$: Subject<void> = new Subject<void>();

  step: 1 | 2 = 1;
  totalPrice: number = 199.00;
  subtotal: number = 171.55;
  tax: number = 27.45;

  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: Address | null = null;

  isSubmitting: boolean = false;
  submissionError: BadRequest | null = null;

  ngOnInit(): void {
    this.step = 1;
    this.subscribeToSelectedAddress();
    this.subscribeToSelectedPaymentMethod();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSelectedAddress() {
    this.paymentCheckoutService.selectedAddress$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (address: Address | null) => {
        console.log('Selected address:', address);
        this.selectedAddress = address;
      }
    });
  }

  private subscribeToSelectedPaymentMethod() {
    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (method: PaymentMethod | null) => {
        console.log('Selected payment method:', method);
        this.selectedPaymentMethod = method;
      }
    });
  }

  handlePlanSelection(): void {
    this.step = 2;
  }

  handleErrorAlertClose(): void {
    this.submissionError = null;
  }

  onProceedPayment(): void {
    this.isSubmitting = true;
    this.submissionError = null;

    const paymentMethodId: number | null = this.selectedPaymentMethod?.id || null;
    const addressId: number | null = this.selectedAddress?.id || null;

    if (!paymentMethodId || !addressId) {
      this.isSubmitting = false;
      console.error('Payment method or address not selected');
      return;
    }

    this.paymentGatewayService.createSubscription(paymentMethodId, addressId).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.submissionError = error;
        console.error(error);
      },
      complete: () => {
        this.isSubmitting = false;
        console.log('Subscription created successfully');
      }
    });
  }
}
