import { Address } from "src/app/_models/addresses/address";
import { addressFormInfo } from "src/app/_models/addresses/addressConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export class AddressForm extends FormGroup2<Address> {
  constructor() {
    super(Address, new Address(), addressFormInfo);
  }
}
