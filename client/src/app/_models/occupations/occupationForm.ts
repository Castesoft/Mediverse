import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Occupation } from "src/app/_models/occupations/occupation";
import { occupationFormInfo } from "src/app/_models/occupations/occupationConstants";

export class OccupationForm extends FormGroup2<Occupation> {
  constructor() {
    super(Occupation, new Occupation(), occupationFormInfo);
  }
}
