import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Address } from "src/app/_models/addresses/address";
import { AccountService } from "src/app/_services/account.service";
import { AddressesService } from "src/app/addresses/addresses.config";
import { AddressSelectorComponent } from "src/app/addresses/components/address-selector/address-selector.component";
import { PaymentCheckoutService } from "src/app/payment-checkout/payment-checkout.service";
import { CollapseDirective } from "ngx-bootstrap/collapse";
import {
  AddressDisplayCardComponent
} from "src/app/addresses/components/address-display-card/address-display-card.component";
import { Subject } from "rxjs";

@Component({
  selector: 'div[checkoutAddressEntryCard]',
  templateUrl: './checkout-address-entry-card.component.html',
  styleUrls: [ './checkout-address-entry-card.component.scss' ],
  imports: [
    AddressSelectorComponent,
    CollapseDirective,
    AddressDisplayCardComponent
  ],
})
export class CheckoutAddressEntryCardComponent implements OnInit, OnDestroy {
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly addressesService: AddressesService = inject(AddressesService);
  private readonly accountsService: AccountService = inject(AccountService);

  private readonly destroy$: Subject<void> = new Subject<void>();

  addresses: Address[] = [];
  selectedAddress: Address | null = null;

  displayCollapsed: boolean = false;
  selectorCollapsed: boolean = true;

  ngOnInit(): void {
    this.getUserAddresses();
    this.subscribeToSelectedAddress();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSelectedAddress() {
    this.paymentCheckoutService.selectedAddress$.subscribe({
      next: (address) => {
        this.selectedAddress = address;
      }
    });
  }

  private getUserAddresses() {
    if (!this.accountsService.current()) {
      console.error("User not authenticated");
      return;
    }

    this.addressesService.getOptionsByUserId(this.accountsService.current()!.id!).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        const defaultAddress: Address | undefined = addresses.find((a: Address) => a.isMain);
        this.selectedAddress = defaultAddress ? defaultAddress : (addresses[0] || null);
      },
      error: (err) => {
        console.error("Error fetching addresses:", err);
      }
    });
  }

  onAddressSelected(address: Address | null) {
    this.paymentCheckoutService.setSelectedAddress(address);
    this.selectorCollapsed = true;
  }

  toggleAddressChange() {
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
