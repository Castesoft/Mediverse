import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentsService } from "src/app/payments/payments.config";
import { Payment } from "src/app/_models/payments/payment";

@Component({
  selector: 'app-payment-checkout-success',
  templateUrl: './payment-checkout-success.component.html',
  styleUrls: [ './payment-checkout-success.component.scss' ]
})
export class PaymentCheckoutSuccessComponent implements OnInit {
  private readonly paymentsService: PaymentsService = inject(PaymentsService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  paymentId: number | null = null;
  payment: Payment | null = null;
  countdown: number = 5;
  redirectUrl: string | null = null;

  ngOnInit(): void {
    const paymentId: string | null = this.route.snapshot.queryParamMap.get('paymentId');
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');

    console.log('PaymentCheckoutSuccessComponent ngOnInit paymentId:', paymentId);

    if (paymentId) {
      this.paymentsService.getById(+paymentId).subscribe({
        next: (payment) => {
          this.payment = payment;
        },
        error: (error) => {
          console.error(`Error retrieving payment with id ${paymentId}: `, error);
        }
      });
    }

    const intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(intervalId);
        this.redirectToUrl();
      }
    }, 1000);
  }

  redirectToUrl(): void {
    if (this.redirectUrl) {
      window.location.href = this.redirectUrl;
    } else {
      this.router.navigate([ '/cuenta' ]).then(() => {});
    }
  }
}
