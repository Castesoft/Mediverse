import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import Nurse from 'src/app/_models/nurses/nurse';
import { nurseFormInfo } from 'src/app/_models/nurses/nurseConstants';

export class NurseForm extends FormGroup2<Nurse> {
  constructor() {
    super(Nurse, new Nurse(), nurseFormInfo);
  }
}
