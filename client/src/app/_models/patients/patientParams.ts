import { EntityParams } from "src/app/_models/base/entityParams";
import { Patient } from "src/app/_models/patients/patient";


export class PatientParams extends EntityParams<Patient> {
  constructor(key: string | null) {
    super(key);
  }
}
