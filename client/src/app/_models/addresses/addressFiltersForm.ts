import { createId } from "@paralleldrive/cuid2";
import { addressFiltersFormInfo } from "src/app/_models/addresses/addressConstants";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";


export class AddressFiltersForm extends FormGroup2<AddressParams> {
  constructor() {
    super(AddressParams as any, new AddressParams(createId()), addressFiltersFormInfo);
  }
}
