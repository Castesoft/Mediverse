import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Address } from "src/app/_models/addresses/address";

@Component({
  selector: 'div[addressDisplayCard]',
  templateUrl: './address-display-card.component.html',
  styleUrl: './address-display-card.component.scss',
  imports: [],
})
export class AddressDisplayCardComponent {
  address: InputSignal<Address> = input.required();
  selected: InputSignal<boolean> = input(false);
  displayOnly: InputSignal<boolean> = input(false);
  selectionMode: InputSignal<boolean> = input(false);

  onAddressEditClicked: OutputEmitterRef<Address> = output();
  onMainAddressSelect: OutputEmitterRef<number> = output();
  onAddressDelete: OutputEmitterRef<number> = output();
  onSelect: OutputEmitterRef<number> = output();

  onRadioChange(): void {
    this.onSelect.emit(this.address().id!)
  }
}
