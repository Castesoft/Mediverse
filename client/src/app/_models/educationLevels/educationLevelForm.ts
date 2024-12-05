import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { EducationLevel } from "src/app/_models/educationLevels/educationLevel";
import { educationLevelFormInfo } from "src/app/_models/educationLevels/educationLevelConstants";

export class EducationLevelForm extends FormGroup2<EducationLevel> {
  constructor() {
    super(EducationLevel, new EducationLevel(), educationLevelFormInfo);
  }
}
