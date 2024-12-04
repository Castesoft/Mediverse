import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { RelativeType } from "src/app/_models/relativeTypes/relativeType";
import { relativeTypeFormInfo } from "src/app/_models/relativeTypes/relativeTypeConstants";

export class RelativeTypeForm extends FormGroup2<RelativeType> {
  constructor() {
    super(RelativeType, new RelativeType(), relativeTypeFormInfo);
  }
}
