import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentNavigationService {
  private router: Router = inject(Router);

  /**
   * Navigates to the checkout page for a given event and patient.
   * Optionally attaches a cancelUrl query parameter so that the checkout page
   * can offer a way to go back.
   *
   * @param eventId - The ID of the event.
   * @param patientId - The ID of the patient.
   * @param cancelUrl - (Optional) The URL to return to if the user cancels.
   * @returns A promise that resolves when navigation is complete.
   */
  navigateToCheckout(eventId: number, patientId: number, cancelUrl?: string): Promise<boolean> {
    const url = `/pagos/cita/${eventId}`;
    const queryParams: any = { eventId, patientId };
    if (cancelUrl) {
      queryParams.cancelUrl = cancelUrl;
    }
    return this.router.navigate([ url ], {
      queryParams
    });
  }

  navigateToCheckoutSuccess(paymentId: number, redirectUrl?: string): Promise<boolean> {
    const url = `/pagos/cita/exito`;
    const queryParams: any = { paymentId };
    if (redirectUrl) {
      queryParams.redirectUrl = redirectUrl;
    }
    return this.router.navigate([ url ], {
      queryParams
    });
  }
}
