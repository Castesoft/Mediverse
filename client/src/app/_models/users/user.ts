import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import Event from "src/app/_models/events/event";
import { Payment } from "src/app/_models/payments/payment";
import {
  UserMedicalInsuranceCompany
} from "src/app/_models/users/userMedicalInsuranceCompany/userMedicalInsuranceCompany";
import { MedicalRecord } from "src/app/_models/medicalRecords/medicalRecord";


export class User extends Entity {
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  email: string | null = null;
  isEmailVerified: boolean = false;
  phoneNumber: string | null = null;
  phoneNumberCountryCode: string | null = null;
  isPhoneNumberVerified: boolean = false;
  hasAccount: boolean = false;
  age: number | null = null;
  sex: SelectOption | null = null;
  photoUrl: string | null = null;
  dateOfBirth: Date | null = null;
  recommendedBy: string | null = null;

  taxId: string | null = null;

  roles: SelectOption[] = [];
  permissions: string[] = [];

  eventsCount: number = 0;
  eventsAmount: number = 0;
  eventsPayable: number = 0;

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
  hasPatientInformationAccess: boolean = false;

  select: SelectOption | null = null;

  constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}
