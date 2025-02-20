import { Component } from '@angular/core';

@Component({
  selector: 'div[addressCreateCard]',
  templateUrl: './address-create-card.component.html',
  styleUrl: './address-create-card.component.scss',
  imports: [],
})
export class AddressCreateCardComponent {
  openAddAddressModal() {
    // this.bsModalService.show(AddressDetailModalComponent, {
    //   initialState: {
    //     title: 'Añadir dirección',
    //   },
    // });
  }
}
