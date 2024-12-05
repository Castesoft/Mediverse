import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Disease } from "src/app/_models/diseases/disease";
import { diseaseFormInfo } from "src/app/_models/diseases/diseaseConstants";

export class DiseaseForm extends FormGroup2<Disease> {
  constructor() {
    super(Disease, new Disease(), diseaseFormInfo);
  }
}
