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
import {
  AddPaymentMethodComponent
} from "src/app/account/components/account-billing/add-payment-method/add-payment-method.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

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
  private readonly bsModalService: BsModalService = inject(BsModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;

  displayCollapsed: boolean = false;
  selectorCollapsed: boolean = true;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.subscribeToSelectedPaymentMethod();
    this.subscribeToUserPaymentMethods();
    this.getUserPaymentMethods();
  }

  private subscribeToSelectedPaymentMethod() {
    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (paymentMethod) => {
        this.selectedPaymentMethod = paymentMethod;
      }
    });
  }

  private subscribeToUserPaymentMethods() {
    this.paymentsService.paymentMethods$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        const defaultMethod: PaymentMethod | undefined = methods.find((m: PaymentMethod) => m.isDefault);
        this.selectedPaymentMethod = defaultMethod ? defaultMethod : (methods[0] ?? null);
        this.paymentCheckoutService.setSelectedPaymentMethod(this.selectedPaymentMethod);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching payment methods:', err);
      },
    })
  }

  getUserPaymentMethods(triggerLoading?: boolean) {
    if (triggerLoading) {
      this.isLoading = true;
    }

    if (!this.accountsService.current()) {
      console.error("User not authenticated");
      this.isLoading = false;
      return;
    }

    this.loadPaymentMethods(this.accountsService.current()!.id!);
  }

  loadPaymentMethods(userId: number): void {
    this.paymentsService.getMethodsForUser(userId).subscribe();
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

  openPaymentMethodCreateModal() {
    const modalRef: BsModalRef<AddPaymentMethodComponent> = this.bsModalService.show(AddPaymentMethodComponent, {
      initialState: { title: 'Añadir método de pago', },
      class: "modal-dialog-centered"
    });

    if (modalRef.onHide) {
      modalRef.onHide.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.getUserPaymentMethods(false);
      });
    }
  }
}
