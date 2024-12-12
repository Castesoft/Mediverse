import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import Patient from "src/app/_models/patients/patient";
import { patientFormInfo } from "src/app/_models/patients/patientConstants";

export class PatientForm extends FormGroup2<Patient> {
  constructor() {
    super(Patient, new Patient(), patientFormInfo);
  }
}
