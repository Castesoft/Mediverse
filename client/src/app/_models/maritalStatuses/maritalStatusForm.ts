import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { MaritalStatus } from "src/app/_models/maritalStatuses/maritalStatus";
import { maritalStatusFormInfo } from "src/app/_models/maritalStatuses/maritalStatusConstants";

export class MaritalStatusForm extends FormGroup2<MaritalStatus> {
  constructor() {
    super(MaritalStatus, new MaritalStatus(), maritalStatusFormInfo);
  }
}
