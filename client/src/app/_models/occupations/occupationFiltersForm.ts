import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { occupationFiltersFormInfo } from "src/app/_models/occupations/occupationConstants";
import { OccupationParams } from "src/app/_models/occupations/occupationParams";

export class OccupationFiltersForm extends FormGroup2<OccupationParams> {
  constructor() {
    super(OccupationParams as any, new OccupationParams(createId()), occupationFiltersFormInfo);
  }
}
