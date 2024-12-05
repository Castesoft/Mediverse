import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { educationLevelFiltersFormInfo } from "src/app/_models/educationLevels/educationLevelConstants";
import { EducationLevelParams } from "src/app/_models/educationLevels/educationLevelParams";

export class EducationLevelFiltersForm extends FormGroup2<EducationLevelParams> {
  constructor() {
    super(EducationLevelParams as any, new EducationLevelParams(createId()), educationLevelFiltersFormInfo);
  }
}
