import { Component, DestroyRef, effect, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Address } from "src/app/_models/addresses/address";
import {
  AddressDisplayCardComponent
} from "src/app/addresses/components/address-display-card/address-display-card.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AddAddressComponent } from "src/app/account/components/account-billing/add-address/add-address.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[addressSelector]',
  templateUrl: './address-selector.component.html',
  styleUrls: [ './address-selector.component.scss' ],
  imports: [ AddressDisplayCardComponent ]
})
export class AddressSelectorComponent {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  addresses: InputSignal<Address[]> = input.required();
  confirmOnSelect: InputSignal<boolean> = input(false);
  showAddressCreateCard: InputSignal<boolean> = input(false);

  selectedAddress: OutputEmitterRef<Address> = output<Address>();
  addressesChanged: OutputEmitterRef<void> = output<void>();

  private _selectedAddress: Address | null = null;
  pendingAddress: Address | null = null;

  constructor() {
    effect(() => {
      const addressList: Address[] = this.addresses();
      const confirmationRequired: boolean = this.confirmOnSelect();

      const defaultAddress: Address | undefined = addressList.find((addr: Address) => addr.isMain);
      this._selectedAddress = defaultAddress ? defaultAddress : (addressList.length > 0 ? addressList[0] : null);

      if (this._selectedAddress) {
        if (!confirmationRequired) {
          this.selectedAddress.emit(this._selectedAddress);
        } else {
          this.pendingAddress = this._selectedAddress;
        }
      }
    });
  }

  onCardClick(address: Address) {
    if (this.confirmOnSelect()) {
      this.pendingAddress = address;
    } else {
      this._selectedAddress = address;
      this.selectedAddress.emit(address);
    }
  }

  /**
   * Confirms the pending selection, setting it as the selected address.
   */
  confirmSelection() {
    if (this.pendingAddress) {
      this._selectedAddress = this.pendingAddress;
      this.selectedAddress.emit(this.pendingAddress);
    }
  }

  /**
   * Determines if a given address is currently selected.
   * When confirmation is required, the pending address is compared.
   */
  isSelected(address: Address): boolean {
    if (this.confirmOnSelect() && this.pendingAddress) {
      return this.pendingAddress.id === address.id;
    }
    return this._selectedAddress?.id === address.id;
  }

  /**
   * Opens a modal for creating a new address.
   */
  openAddressCreateModal() {
    const modalRef: BsModalRef<AddAddressComponent> | undefined = this.bsModalService.show(AddAddressComponent, {
      initialState: { title: 'Añadir nueva dirección' },
      class: "modal-dialog-centered"
    });

    if (modalRef?.onHide) {
      modalRef.onHide.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.addressesChanged.emit();
      });
    }
  }
}
