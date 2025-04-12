import { Component, DestroyRef, inject, input, InputSignal, OnInit } from '@angular/core';
import { Address } from "src/app/_models/addresses/address";
import { AccountService } from "src/app/_services/account.service";
import { AddressesService } from "src/app/addresses/addresses.config";
import { AddressSelectorComponent } from "src/app/addresses/components/address-selector/address-selector.component";
import { PaymentCheckoutService } from "src/app/payment-checkout/payment-checkout.service";
import { CollapseDirective } from "ngx-bootstrap/collapse";
import {
  AddressDisplayCardComponent
} from "src/app/addresses/components/address-display-card/address-display-card.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AddAddressComponent } from "src/app/account/components/account-billing/add-address/add-address.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

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
export class CheckoutAddressEntryCardComponent implements OnInit {
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly addressesService: AddressesService = inject(AddressesService);
  private readonly accountsService: AccountService = inject(AccountService);
  private readonly bsModalService: BsModalService = inject(BsModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  title: InputSignal<string> = input('Dirección de Entrega');

  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  isLoading: boolean = false;

  displayCollapsed: boolean = false;
  selectorCollapsed: boolean = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.subscribeToSelectedAddress();
    this.subscribeToUserAddresses();
    this.getUserAddresses();
  }

  private subscribeToSelectedAddress() {
    this.paymentCheckoutService.selectedAddress$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (address) => {
        this.selectedAddress = address;
      }
    });
  }

  private subscribeToUserAddresses() {
    this.addressesService.addressOptions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        const defaultAddress: Address | undefined = addresses.find((a: Address) => a.isMain);
        this.selectedAddress = defaultAddress ? defaultAddress : (addresses[0] || null);
        this.paymentCheckoutService.setSelectedAddress(this.selectedAddress);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error fetching addresses:", err);
      },
    });
  }

  getUserAddresses(toggleLoading?: boolean) {
    if (toggleLoading) {
      this.isLoading = true;
    }

    if (!this.accountsService.current()) {
      console.error("User not authenticated");
      this.isLoading = false;
      return;
    }

    this.loadUserAddresses(this.accountsService.current()!.id!);
  }

  loadUserAddresses(userId: number): void {
    this.addressesService.getOptionsByUserId(userId).subscribe();
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

  openAddressCreateModal() {
    const modalRef: BsModalRef<AddAddressComponent> = this.bsModalService.show(AddAddressComponent, {
      initialState: { title: 'Añadir nueva dirección' },
      class: "modal-dialog-centered"
    });

    modalRef.onHidden?.subscribe(() => {
      this.getUserAddresses(false);
    });
  }
}
