import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import Event from "../events/event";
import { Payment } from "../payments/payment";
import { UserMedicalInsuranceCompany } from "./userMedicalInsuranceCompany/userMedicalInsuranceCompany";
import { MedicalRecord } from "../medicalRecords/medicalRecord";


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
