import { Component, input, InputSignal } from '@angular/core';
import { Address } from 'src/app/_models/addresses/address';

@Component({
  selector: 'td[addressTableCell]',
  templateUrl: './address-table-cell.component.html',
  styleUrls: [ './address-table-cell.component.scss' ],
  standalone: true,
})
export class AddressTableCellComponent {
  address: InputSignal<Address | null> = input.required();
  compact: InputSignal<boolean> = input(false);
}
