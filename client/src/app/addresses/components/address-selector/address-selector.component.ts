import { Component, effect, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Address } from "src/app/_models/addresses/address";
import {
  AddressDisplayCardComponent
} from "src/app/addresses/components/address-display-card/address-display-card.component";
import { BsModalService } from "ngx-bootstrap/modal";
import {
  AddPaymentMethodComponent
} from "src/app/account/components/account-billing/add-payment-method/add-payment-method.component";

@Component({
  selector: 'div[addressSelector]',
  templateUrl: './address-selector.component.html',
  styleUrls: [ './address-selector.component.scss' ],
  imports: [ AddressDisplayCardComponent ]
})
export class AddressSelectorComponent {
  private readonly bsModalService: BsModalService = inject(BsModalService);

  addresses: InputSignal<Address[]> = input.required();
  confirmOnSelect: InputSignal<boolean> = input(false);
  showAddressCreateCard: InputSignal<boolean> = input(false);

  selectedAddress: OutputEmitterRef<Address> = output<Address>();

  private _selectedAddress: Address | null = null;
  pendingAddress: Address | null = null;

  constructor() {
    effect(() => {
      const methods: Address[] = this.addresses();
      const defaultMethod: Address | undefined = methods.find((pm: Address) => pm.isMain);
      this._selectedAddress = defaultMethod ? defaultMethod : (methods.length > 0 ? methods[0] : null);
      if (this._selectedAddress) {
        if (!this.confirmOnSelect()) {
          this.selectedAddress.emit(this._selectedAddress);
        } else {
          this.pendingAddress = this._selectedAddress;
        }
      }
    });
  }

  onCardClick(method: Address) {
    if (this.confirmOnSelect()) {
      this.pendingAddress = method;
    } else {
      this._selectedAddress = method;
      this.selectedAddress.emit(method);
    }
  }

  confirmSelection() {
    if (this.pendingAddress) {
      this._selectedAddress = this.pendingAddress;
      this.selectedAddress.emit(this.pendingAddress);
    }
  }

  isSelected(method: Address): boolean {
    if (this.confirmOnSelect() && this.pendingAddress) {
      return this.pendingAddress.id === method.id;
    }
    return this._selectedAddress?.id === method.id;
  }

  openAddressCreateModal() {
    this.bsModalService.show(AddPaymentMethodComponent, {
      initialState: { title: 'Añadir método de pago', },
      class: "modal-dialog-centered"
    });
  }
}
