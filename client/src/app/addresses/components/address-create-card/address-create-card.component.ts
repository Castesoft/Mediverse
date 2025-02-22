import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { BsModalService } from "ngx-bootstrap/modal";
import { AddAddressComponent } from "src/app/account/components/account-billing/add-address/add-address.component";
import { Address } from "src/app/_models/addresses/address";

@Component({
  selector: 'div[addressCreateCard]',
  templateUrl: './address-create-card.component.html',
  styleUrl: './address-create-card.component.scss',
  imports: [],
})
export class AddressCreateCardComponent {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  onAddressCreated: OutputEmitterRef<Address> = output();

  openAddressCreateModal() {
    this.bsModalService.show(AddAddressComponent, {
      initialState: {
        title: 'Añadir dirección',
        reloadAddresses: (address: Address) => this.onAddressCreated.emit(address)
      },
      class: "modal-dialog-centered"
    });
  }
}
