import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { PaymentCheckoutService } from "src/app/payment-checkout/payment-checkout.service";
import { PaymentsService } from "src/app/payments/payments.config";
import { AccountService } from "src/app/_services/account.service";
import { CollapseDirective } from "ngx-bootstrap/collapse";
import {
  PaymentMethodSelectorComponent
} from "src/app/account/components/account-billing/components/payment-method-selector.component";
import {
  PaymentMethodDisplayCardComponent
} from "src/app/account/components/account-billing/components/payment-method-display-card.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[checkoutPaymentMethodEntryCard]',
  templateUrl: './checkout-payment-method-entry-card.component.html',
  styleUrl: './checkout-payment-method-entry-card.component.scss',
  imports: [
    CollapseDirective,
    PaymentMethodSelectorComponent,
    PaymentMethodDisplayCardComponent
  ],
})
export class CheckoutPaymentMethodEntryCardComponent implements OnInit {
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly paymentsService: PaymentsService = inject(PaymentsService);
  private readonly accountsService: AccountService = inject(AccountService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;

  displayCollapsed: boolean = false;
  selectorCollapsed: boolean = true;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getUserPaymentMethods();
    this.subscribeToSelectedPaymentMethod();
  }

  private subscribeToSelectedPaymentMethod() {
    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (paymentMethod) => {
        this.selectedPaymentMethod = paymentMethod;
      }
    });
  }

  private getUserPaymentMethods() {
    this.isLoading = true;

    if (!this.accountsService.current()) {
      console.error("User not authenticated");
      return;
    }

    this.paymentsService.getMethodsForUser(this.accountsService.current()!.id!).subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        const defaultMethod: PaymentMethod | undefined = methods.find((m: PaymentMethod) => m.isDefault);
        this.selectedPaymentMethod = defaultMethod ? defaultMethod : (methods[0] ?? null);
        this.paymentCheckoutService.setSelectedPaymentMethod(this.selectedPaymentMethod);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching payment methods:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPaymentMethodSelected(address: PaymentMethod | null) {
    this.paymentCheckoutService.setSelectedPaymentMethod(address);
    this.selectorCollapsed = true;
  }

  togglePaymentMethodChange() {
    if (!this.displayCollapsed) {
      this.displayCollapsed = true;
    } else if (!this.selectorCollapsed) {
      this.selectorCollapsed = true;
    }
  }

  onDisplayHidden() {
    if (this.displayCollapsed) {
      this.selectorCollapsed = false;
    }
  }

  onSelectorHidden() {
    if (this.selectorCollapsed) {
      this.displayCollapsed = false;
    }
  }
}
