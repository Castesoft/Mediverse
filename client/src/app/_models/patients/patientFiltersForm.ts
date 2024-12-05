import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { patientFiltersFormInfo } from "src/app/_models/patients/patientConstants";
import { PatientParams } from "src/app/_models/patients/patientParams";

export class PatientFiltersForm extends FormGroup2<PatientParams> {
  constructor() {
    super(PatientParams as any, new PatientParams(createId()), patientFiltersFormInfo);
  }
}
