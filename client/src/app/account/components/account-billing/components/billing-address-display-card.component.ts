import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { UserAddress } from "src/app/_models/billingDetails";

@Component({
  selector: 'div[billingAddressDisplayCard]',
  templateUrl: './billing-address-display-card.component.html',
  styleUrl: './billing-address-display-card.component.scss',
  imports: [],
})
export class BillingAddressDisplayCardComponent {
  index: InputSignal<number> = input.required();
  address: InputSignal<UserAddress> = input.required();

  onAddressDeleted: OutputEmitterRef<number> = output();
  onAddressEditClicked: OutputEmitterRef<UserAddress> = output();
}
