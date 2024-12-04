import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { substanceFiltersFormInfo } from "src/app/_models/substances/substanceConstants";
import { SubstanceParams } from "src/app/_models/substances/substanceParams";

export class SubstanceFiltersForm extends FormGroup2<SubstanceParams> {
  constructor() {
    super(SubstanceParams as any, new SubstanceParams(createId()), substanceFiltersFormInfo);
  }
}
