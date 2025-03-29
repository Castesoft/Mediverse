import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentCalculationService {
  private readonly DEFAULT_TAX_RATE: number = 0;

  calculateTax(subtotal: number, discount: number = 0, taxRate: number = this.DEFAULT_TAX_RATE): number {
    const effectiveSubtotal: number = Math.max(0, subtotal - discount);
    return effectiveSubtotal * taxRate;
  }

  calculateTotal(subtotal: number, discount: number = 0, taxRate: number = this.DEFAULT_TAX_RATE): number {
    const effectiveSubtotal: number = Math.max(0, subtotal - discount);
    return effectiveSubtotal + this.calculateTax(subtotal, discount, taxRate);
  }
}
