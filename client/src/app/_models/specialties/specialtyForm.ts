import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Specialty } from "src/app/_models/specialties/specialty";
import { specialtyFormInfo } from "src/app/_models/specialties/specialtyConstants";

export class SpecialtyForm extends FormGroup2<Specialty> {
  constructor() {
    super(Specialty, new Specialty(), specialtyFormInfo);
  }
}
