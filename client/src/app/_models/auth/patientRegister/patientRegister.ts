import { Entity } from 'src/app/_models/base/entity';
import { SelectOption } from 'src/app/_models/base/selectOption';

export default class PatientRegister extends Entity {
  firstName: string | null = null;
  lastName: string | null = null;
  sex: SelectOption | null = null;
  dateOfBirth: Date | null = null;
  email: string | null = null;
  password: string | null = null;
  confirmPassword: string | null = null;
  agreeTerms: boolean = false;

  constructor(init?: Partial<PatientRegister>) {
    super();
    Object.assign(this, init);
  }
}
