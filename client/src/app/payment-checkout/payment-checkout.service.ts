import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import { Address } from 'src/app/_models/addresses/address';

@Injectable({
  providedIn: 'root'
})
export class PaymentCheckoutService {
  private selectedPaymentMethodSubject: BehaviorSubject<PaymentMethod | null> = new BehaviorSubject<PaymentMethod | null>(null);
  private selectedAddressSubject: BehaviorSubject<Address | null> = new BehaviorSubject<Address | null>(null);

  selectedPaymentMethod$: Observable<PaymentMethod | null> = this.selectedPaymentMethodSubject.asObservable();
  selectedAddress$: Observable<Address | null> = this.selectedAddressSubject.asObservable();

  setSelectedPaymentMethod(method: PaymentMethod | null): void {
    this.selectedPaymentMethodSubject.next(method);
  }

  setSelectedAddress(address: Address | null): void {
    this.selectedAddressSubject.next(address);
  }
}
