import { EntityParams } from "src/app/_models/base/entityParams";
import { Patient } from 'src/app/_models/patients/patient';
import { SelectOption } from "src/app/_models/base/selectOption";


export class PatientParams extends EntityParams<Patient> {
  firstName: string | null = null;
  lastName: string | null = null;
  sex: SelectOption | null = null;

  phoneNumber: string | null = null;
  rfc: string | null = null;

  prescriptions: number | null = null;
  ageFrom: number | null = null;
  events: number | null = null;
  orders: number | null = null;
  ageTo: number | null = null;

  birthDateFrom: Date | null = null;
  birthDateTo: Date | null = null;

  createdAtFrom: Date | null = null;
  createdAtTo: Date | null = null;

  constructor(key: string | null, init?: Partial<PatientParams>) {
    super(key);
    Object.assign(this, init);
  }
}
