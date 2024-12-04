import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { relativeTypeFiltersFormInfo } from "src/app/_models/relativeTypes/relativeTypeConstants";
import { RelativeTypeParams } from "src/app/_models/relativeTypes/relativeTypeParams";

export class RelativeTypeFiltersForm extends FormGroup2<RelativeTypeParams> {
  constructor() {
    super(RelativeTypeParams as any, new RelativeTypeParams(createId()), relativeTypeFiltersFormInfo);
  }
}
