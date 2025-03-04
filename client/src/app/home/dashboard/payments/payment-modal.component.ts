import { Component, inject, OnInit } from '@angular/core';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import { CreatePaymentIntentResponse } from 'src/app/_models/payments/createPaymentIntentResponse';
import { StripeGatewayService } from 'src/app/_services/stripe-gateway.service';
import { PaymentsService } from 'src/app/payments/payments.config';
import { EventsService } from 'src/app/events/events.config';
import { CurrencyPipe } from '@angular/common';
import { PaymentIntent, PaymentIntentResult, Stripe } from '@stripe/stripe-js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import {
  PaymentMethodSelectorComponent
} from "src/app/account/components/account-billing/components/payment-method-selector.component";
import { DevService } from "src/app/_services/dev.service";

export interface PaymentModalData {
  eventId: number;
  patientId: number;
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  imports: [
    CurrencyPipe,
    MaterialModule,
    CdkModule,
    PaymentMethodSelectorComponent
  ],
  standalone: true
})
export class PaymentModalComponent implements OnInit {
  data: PaymentModalData = inject(MAT_DIALOG_DATA);

  dev: DevService = inject(DevService);

  private stripePaymentsService: StripeGatewayService = inject(StripeGatewayService);
  private paymentsService: PaymentsService = inject(PaymentsService);
  private eventsService: EventsService = inject(EventsService);

  private dialogRef: MatDialogRef<PaymentModalComponent> = inject(MatDialogRef);

  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;

  event: any = null;
  message: string = '';

  ngOnInit(): void {
    this.getEventDetails(this.data.eventId);
    this.getUserPaymentMethods();
  }

  private getEventDetails(eventId: number) {
    this.eventsService.getById(eventId).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
      }
    });
  }

  private getUserPaymentMethods() {
    this.paymentsService.getMethodsForUser(this.data.patientId).subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        const defaultMethod: PaymentMethod | undefined = methods.find((m: PaymentMethod) => m.isDefault);
        this.selectedPaymentMethod = defaultMethod ? defaultMethod : (methods[0] ?? null);
      },
      error: (err) => {
        console.error('Error fetching payment methods:', err);
      }
    });
  }

  selectPaymentMethod(method: PaymentMethod) {
    this.selectedPaymentMethod = method;
  }

  async pay() {
    if (
      !this.selectedPaymentMethod ||
      !this.selectedPaymentMethod.stripePaymentMethodId ||
      !this.selectedPaymentMethod.id
    ) {
      this.message = 'Please select a valid payment method.';
      return;
    }

    this.stripePaymentsService.createPaymentIntentForEvent(this.data.eventId, this.selectedPaymentMethod.id)
      .subscribe({
        next: async (res: CreatePaymentIntentResponse) => {
          const stripe: Stripe | null = await this.stripePaymentsService.getStripeInstance();
          if (!stripe) {
            this.message = 'Stripe not initialized.';
            return;
          }

          const retrieveResult: PaymentIntentResult = await stripe.retrievePaymentIntent(res.clientSecret);
          const paymentIntent: PaymentIntent | undefined = retrieveResult.paymentIntent;

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            this.message = 'Payment successful!';
            this.dialogRef.close({ success: true });
            return;
          }

          if (paymentIntent && paymentIntent.status === 'requires_action') {
            const { error, paymentIntent: confirmedPI } = await this.stripePaymentsService.confirmCardPayment(
              this.selectedPaymentMethod?.stripePaymentMethodId || '',
              res.clientSecret
            );
            if (error) {
              console.error('Payment confirmation error:', error.message);
              this.message = `Payment failed: ${error.message}`;
            } else if (confirmedPI) {
              this.message = confirmedPI.status === 'succeeded'
                ? 'Payment successful!'
                : `Payment status: ${confirmedPI.status}`;
              if (confirmedPI.status === 'succeeded') {
                this.dialogRef.close({ success: true });
              }
            }
          }
        },
        error: (err: any) => {
          console.error('Error creating PaymentIntent:', err);
          this.message = 'Error creating payment intent.';
        }
      });
  }
}
