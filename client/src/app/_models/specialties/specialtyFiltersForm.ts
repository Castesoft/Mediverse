import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { specialtyFiltersFormInfo } from "src/app/_models/specialties/specialtyConstants";
import { SpecialtyParams } from "src/app/_models/specialties/specialtyParams";

export class SpecialtyFiltersForm extends FormGroup2<SpecialtyParams> {
  constructor() {
    super(SpecialtyParams as any, new SpecialtyParams(createId()), specialtyFiltersFormInfo);
  }
}
