import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { maritalStatusFiltersFormInfo } from "src/app/_models/maritalStatuses/maritalStatusConstants";
import { MaritalStatusParams } from "src/app/_models/maritalStatuses/maritalStatusParams";

export class MaritalStatusFiltersForm extends FormGroup2<MaritalStatusParams> {
  constructor() {
    super(MaritalStatusParams as any, new MaritalStatusParams(createId()), maritalStatusFiltersFormInfo);
  }
}
