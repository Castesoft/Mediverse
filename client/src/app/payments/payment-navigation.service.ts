import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentNavigationService {
  private router: Router = inject(Router);

  /**
   * Navigates to the checkout page for a given item and patient.
   * The URL is constructed as `/pagos/{extraSegment}/{type}/{itemId}`.
   * Optionally attaches a cancelUrl query parameter so that the checkout page
   * can offer a way to go back.
   *
   * @param itemId - The ID of the item.
   * @param patientId - The ID of the patient.
   * @param type - The type of the item; must be 'receta', 'cita', or 'medicamentos'.
   * @param cancelUrl - (Optional) The URL to return to if the user cancels.
   * @returns A promise that resolves when navigation is complete.
   */
  navigateToCheckout(
    itemId: number,
    patientId: number,
    type: 'receta' | 'cita' | 'medicamentos',
    cancelUrl?: string
  ): Promise<boolean> {
    // Construct the URL using the extraSegment, type, and itemId.
    const url = `/pagos/${type}/${itemId}`;
    const queryParams: { [key: string]: any } = { patientId };

    if (cancelUrl) {
      queryParams['cancelUrl'] = cancelUrl;
    }

    return this.router.navigate([ url ], { queryParams });
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
