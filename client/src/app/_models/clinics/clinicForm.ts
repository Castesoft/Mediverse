import { Clinic } from "src/app/_models/clinics/clinic";
import { clinicFormInfo } from "src/app/_models/clinics/clinicConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export class ClinicForm extends FormGroup2<Clinic> {
  constructor() {
    super(Clinic, new Clinic(), clinicFormInfo);
  }
}
