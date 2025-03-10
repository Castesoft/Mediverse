import PatientRegister from 'src/app/_models/auth/patientRegister/patientRegister';
import { patientRegisterFormInfo } from 'src/app/_models/auth/patientRegister/patientRegisterConstants';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

export default class PatientRegisterForm extends FormGroup2<PatientRegister> {
  constructor() {
    super(PatientRegister, new PatientRegister(), patientRegisterFormInfo);
  }
}
