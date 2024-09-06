import { createId } from "@paralleldrive/cuid2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Role } from "src/app/_models/types";
import { PaymentMethodType } from './paymentMethodType';
import { WorkSchedule } from './workSchedule';

export class Account {
  id!: number;
  username!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  email!: string;
  isEmailVerified = false;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  isPhoneNumberVerified = false;
  sex!: string;
  token!: string;
  photoUrl?: string;
  bannerUrl?: string;
  mainSpecialty!: string;
  linkedEmail!: boolean;
  linkedGoogle!: boolean;
  twoFactorEnabled!: boolean;
  specialtyId!: string;
  paymentMethodTypes: PaymentMethodType[] = [];
  medicalLicenses?: MedicalLicense[];
  requireAnticipatedCardPayments!: boolean;
  workSchedules: WorkSchedule[] = [];
  workScheduleSettings?: WorkScheduleSettings;
  doctorClinics: DoctorClinic[] = [];
  country!: string;
  state!: string;
  city!: string;
  address!: string;
  dateOfBirth?: Date;
  createdAt = new Date();

  requiresTwoFactor?: boolean;

  roles: Role[] = [];
  permissions: string[] = [];
}

export interface DoctorClinic {
  id: number;
  isMain: boolean;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
}

export interface MedicalLicense {
  document: Document;
  isMain: boolean;
  licenseNumber: string;
  specialtyLicense: string;
  specialtyId: number;
  specialtyName: string;
}

export interface Document {
  url: string;
  publicId: string;
  size: number;
  name: string;
  description: string;
  id: number;
  createdAt: Date;
}
export class WorkScheduleSettings {
  startTime?: string;
  endTime?: string;
  minutesPerBlock?: number;
}

export const genders = [
  {
    id: 'Masculino',
    value: 'Masculino'
  },
  {
    id: 'Femenino',
    value: 'Femenino'
  },
  {
    id: 'Otro',
    value: 'Otro',
  },
  {
    id: 'Prefiero no contestar',
    value: 'Prefiero no contestar'
  }
];

export class PasswordResetForm {
  formGroup: FormGroup;
  id: string;
  subject = 'newPassword';
  submitted = false;

  constructor() {
    this.id = `${this.subject}Form${createId()}`;
    this.formGroup = new FormGroup({
      email: new FormControl(''),
    });

  }

  setValidators(mode: boolean) {
    if (mode) {
      this.formGroup.controls['email'].setValidators([Validators.required, Validators.email]);
    } else {
      this.formGroup.controls['email'].clearValidators();
      this.formGroup.controls['email'].clearAsyncValidators();
    }

    this.formGroup.updateValueAndValidity();
  }

  patchWithSample = () => this.formGroup.patchValue({email: getRandomEmail()});

}

export const sampleEmails: string[] = [
  "example1@example.com", "example2@example.com", "example3@example.com", "example4@example.com", "example5@example.com", "example6@example.com", "example7@example.com",
  "example8@example.com", "example9@example.com", "example10@example.com", "example11@example.com", "example12@example.com", "example13@example.com",
  "example14@example.com", "example15@example.com", "example16@example.com", "example17@example.com", "example18@example.com", "example19@example.com", "example20@example.com",
  "example21@example.com", "example22@example.com", "example23@example.com", "example24@example.com", "example25@example.com", "example26@example.com", "example27@example.com",
  "example28@example.com", "example29@example.com", "example30@example.com", "example31@example.com", "example32@example.com", "example33@example.com", "example34@example.com",
  "example35@example.com", "example36@example.com", "example37@example.com", "example38@example.com", "example39@example.com", "example40@example.com", "example41@example.com",
  "example42@example.com", "example43@example.com", "example44@example.com", "example45@example.com", "example46@example.com", "example47@example.com", "example48@example.com",
  "example49@example.com", "example50@example.com"
];

export const getRandomEmail = () => {
  const randomIndex = Math.floor(Math.random() * sampleEmails.length);
  return sampleEmails[randomIndex];
}

