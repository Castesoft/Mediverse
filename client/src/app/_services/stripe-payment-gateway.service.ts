import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { CreatePaymentIntentResponse } from "src/app/_models/payments/createPaymentIntentResponse";
import { loadStripe, PaymentIntentResult, Stripe } from "@stripe/stripe-js";

export interface PaymentResponse {
  paymentIntentId: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripePaymentGatewayService {
  private stripePromise: Promise<Stripe | null> = loadStripe(environment.stripe_pk);
  private baseUrl: string = `${environment.apiUrl}payments/`;
  private http: HttpClient = inject(HttpClient);

  /**
   * Confirms a card payment using Stripe.
   * @param paymentMethodId - The Stripe payment method ID.
   * @param clientSecret - The client secret provided by the backend.
   * @returns A promise resolving to the PaymentIntentResult.
   * @throws An error if Stripe is not initialized.
   */
  async confirmCardPayment(paymentMethodId: string, clientSecret: string): Promise<PaymentIntentResult> {
    const stripe: Stripe | null = await this.stripePromise;
    if (!stripe) {
      throw new Error("Stripe not initialized. Please check your configuration.");
    }
    return await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId
    });
  }

  /**
   * Retrieves the Stripe instance (after initialization).
   * @returns A promise resolving to the Stripe instance or null.
   */
  async getStripeInstance(): Promise<Stripe | null> {
    return await this.stripePromise;
  }

  /**
   * Creates a PaymentIntent for a given event.
   * @param eventId - The event identifier.
   * @param paymentMethodId - The internal payment method ID to be used.
   * @returns An Observable emitting a CreatePaymentIntentResponse.
   */
  createPaymentIntentForEvent(eventId: number, paymentMethodId: number): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(
      `${this.baseUrl}create-payment-intent/event/${eventId}`, { paymentMethodId }
    );
  }
}
