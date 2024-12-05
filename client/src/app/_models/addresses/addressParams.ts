import { Address } from "src/app/_models/addresses/address";
import { Addresses } from "src/app/_models/addresses/addressTypes";
import { EntityParams } from "src/app/_models/base/entityParams";

export class AddressParams extends EntityParams<Address> {
  type: Addresses = 'Clinic';

  constructor(key: string | null) {
    super(key);
  }
}
