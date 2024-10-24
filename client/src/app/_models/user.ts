import { HttpParams } from "@angular/common/http";
import { Entity, EntityParams, IParams } from "src/app/_models/types";
import { buildHttpParams, omitKeys } from "src/app/_utils/util";
import { Payment } from './payment';
import { Event } from "./event";
import { MedicalRecord } from '../account/components/account-clinical-history/clinical-history-form/clinical-history-form.component';
import { SelectOption } from "src/app/_forms/form";
import { UserMedicalInsuranceCompany } from "src/app/_models/userMedicalInsuranceCompany";

const subject = 'user';

export class User extends Entity {
  username!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  email!: string;
  isEmailVerified = false;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  isPhoneNumberVerified = false;
  hasAccount = false;
  age!: number;
  sex!: string;
  photoUrl?: string;
  dateOfBirth!: Date;

  taxId?: string;

  roles: string[] = [];
  permissions: string[] = [];

  eventsCount = 0;
  eventsAmount = 0;
  eventsPayable = 0;

  street!: string;
  exteriorNumber!: string;
  interiorNumber?: string;
  neighborhood?: string;
  city!: string;
  state!: string;
  country!: string;
  zipcode!: string;

  post?: string;
  education?: string;

  medicalInsuranceCompanies?: UserMedicalInsuranceCompany[];
  doctorEvents?: Event[];
  doctorPayments?: Payment[];
  medicalRecord?: MedicalRecord;
  hasPatientInformationAccess = false;
}

export class UserParams extends EntityParams<User> implements IParams {

  constructor(key: string) {
    super(key);
  }

  get httpParams(): HttpParams {
    return buildHttpParams(omitKeys(this, ['key', 'httpParams', 'id']));
  }

  private isSelectItemArray(array: any[]): array is SelectOption[] {
    return array.length > 0 && typeof array[0] === 'object' && 'value' in array[0];
  }
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  email: string;
  sex: string;
  age: string;
  photoUrl: string;
}
