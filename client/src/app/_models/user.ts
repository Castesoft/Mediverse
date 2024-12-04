import { Payment } from './payment';
import { Event } from "./event";
import { MedicalRecord } from '../account/components/account-clinical-history/clinical-history-form/clinical-history-form.component';
import { SelectOption } from "src/app/_forms/form";
import { UserMedicalInsuranceCompany } from "src/app/_models/userMedicalInsuranceCompany";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { Entity, baseInfo } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";

export class User extends Entity {
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  email: string | null = null;
  isEmailVerified = false;
  phoneNumber: string | null = null;
  phoneNumberCountryCode: string | null = null;
  isPhoneNumberVerified = false;
  hasAccount = false;
  age: number | null = null;
  sex: SelectOption | null = null;
  photoUrl: string | null = null;
  dateOfBirth: Date | null = null;

  taxId: string | null = null;

  roles: string[] = [];
  permissions: string[] = [];

  eventsCount = 0;
  eventsAmount = 0;
  eventsPayable = 0;

  street: string | null = null;
  exteriorNumber: string | null = null;
  interiorNumber: string | null = null;
  neighborhood: string | null = null;
  city: string | null = null;
  state: string | null = null;
  country: string | null = null;
  zipcode: string | null = null;

  post: string | null = null;
  education: string | null = null;

  medicalInsuranceCompanies: UserMedicalInsuranceCompany[] = [];
  doctorEvents: Event[] = [];
  doctorPayments: Payment[] = [];
  medicalRecord: MedicalRecord = new MedicalRecord();
  hasPatientInformationAccess = false;

  select: SelectOption | null = null;

  constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}

export const userInfo: FormInfo<User> = {
  ...baseInfo,
  age: { label: 'Edad', type: 'number', },
  city: { label: 'Ciudad', type: 'text', },
  country: { label: 'País', type: 'text', },
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date', },
  // doctorEvents: eventInfo,
  select: { label: 'Usuario', type: 'typeahead', orientation: 'inline' },
} as FormInfo<User>;

export class UserForm extends FormGroup2<User> {
  constructor() {
    super(User, new User(), userInfo);
  }
}

export class UserParams extends EntityParams<User> {

  constructor(key: string) {
    super(key);
  }
}
