import { createId } from "@paralleldrive/cuid2";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Role } from "src/app/_models/types";
import { paymentMethodTypeFormInfo } from "./paymentMethodTypes/paymentMethodTypeConstants";
import { PaymentMethodType } from "./paymentMethodTypes/paymentMethodType";
import { WorkSchedule, workScheduleInfo } from './workSchedule';
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { MedicalLicense, medicalLicenseInfo } from "src/app/_models/medicalLicense";
import { SelectOption } from "src/app/_forms/form";
import { Doctor, doctorInfo } from "src/app/_models/doctor";
import { WorkScheduleSettings, workScheduleSettingsInfo } from "src/app/_models/workScheduleSettings";
import { DoctorClinic } from "src/app/_models/doctorClinic";
import { UserMedicalInsuranceCompany, userMedicalInsuranceCompanyInfo } from "src/app/_models/userMedicalInsuranceCompany";

export class Account {
  id: number | null = null;
  acceptedPaymentMethods: SelectOption[] = [];
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  email: string | null = null;
  isEmailVerified: boolean = false;
  phoneNumber: string | null = null;
  phoneNumberCountryCode: string | null = null;
  isPhoneNumberVerified: boolean = false;
  sex: SelectOption | null = null;
  token: string | null = null;
  photoUrl: string | null = null;
  bannerUrl: string | null = null;
  mainSpecialty: string | null = null;
  linkedEmail: boolean = false;
  linkedGoogle: boolean = false;
  twoFactorEnabled: boolean = false;
  specialty: SelectOption | null = null;
  paymentMethodTypes: PaymentMethodType[] = [];
  medicalLicenses: MedicalLicense[] = [];
  requireAnticipatedCardPayments: boolean = false;
  workSchedules: WorkSchedule[] = [] = [];
  workScheduleSettings: WorkScheduleSettings = new WorkScheduleSettings();
  doctorClinics: DoctorClinic[] = [];
  sharedDoctors: Doctor[] = [];
  country: string | null = null;
  state: string | null = null;
  city: string | null = null;
  address: string | null = null;
  dateOfBirth: Date | null = null;
  createdAt: Date | null = null;

  requiresTwoFactor: boolean = false;
  removeAvatar: boolean = false;

  roles: Role[] = [];
  permissions: string[] = [];
  photoFile: any;
  certificateFile: any;

  licenseNumber: string | null = null;
  specialtyLicense: string | null = null;

  medicalInsuranceCompanies: UserMedicalInsuranceCompany[] = [];
  doctorInsuranceCompanies: SelectOption[] = [];

  constructor(init?: Partial<Account>) {
    Object.assign(this, init);
  }
}

export const accountInfo: FormInfo<Account> = {
  medicalInsuranceCompanies: userMedicalInsuranceCompanyInfo,
  certificateFile: { label: 'Cédula/Certificación', type: 'file' },
  licenseNumber: { label: 'Cédula Profesional', type: 'text' },
  photoFile: { label: 'Archivo de foto', type: 'file' },
  specialtyLicense: { label: 'Cédula de Especialidad', type: 'text' },
  acceptedPaymentMethods: { label: 'Métodos de pago aceptados', type: 'select' },
  removeAvatar: { label: 'Eliminar avatar', type: 'checkbox' },
  address: { label: 'Dirección', type: 'text' },
  bannerUrl: { label: 'Banner URL', type: 'text' },
  city: { label: 'Ciudad', type: 'text' },
  country: { label: 'País', type: 'text' },
  createdAt: { label: 'Creado en', type: 'date' },
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date' },
  doctorClinics: {},
  email: { label: 'Email', type: 'text' },
  firstName: { label: 'Nombre', type: 'text' },
  fullName: { label: 'Nombre completo', type: 'text' },
  id: { label: 'ID', type: 'number' },
  isEmailVerified: { label: 'Email verificado', type: 'checkbox' },
  isPhoneNumberVerified: { label: 'Teléfono verificado', type: 'checkbox' },
  lastName: { label: 'Apellido', type: 'text' },
  linkedEmail: { label: 'Email vinculado', type: 'checkbox' },
  linkedGoogle: { label: 'Google vinculado', type: 'checkbox' },
  mainSpecialty: { label: 'Especialidad principal', type: 'text' },
  medicalLicenses: medicalLicenseInfo,
  paymentMethodTypes: paymentMethodTypeFormInfo,
  permissions: {  },
  phoneNumber: { label: 'Teléfono', type: 'text' },
  phoneNumberCountryCode: { label: 'Código de país de teléfono', type: 'text' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  requireAnticipatedCardPayments: { label: 'Requiere pagos anticipados con tarjeta', type: 'checkbox' },
  requiresTwoFactor: { label: 'Requiere autenticación de dos factores', type: 'checkbox' },
  roles: { },
  sex: { label: 'Sexo', type: 'select' },
  sharedDoctors: doctorInfo,
  specialty: { label: 'Especialidad', type: 'select' },
  state: { label: 'Estado', type: 'text' },
  token: { label: 'Token', type: 'text' },
  twoFactorEnabled: { label: 'Dos factores habilitados', type: 'checkbox' },
  username: { label: 'Nombre de usuario', type: 'text' },
  workSchedules: workScheduleInfo,
  workScheduleSettings: workScheduleSettingsInfo,
} as FormInfo<Account>;

export class AccountForm extends FormGroup2<Account> {
  constructor() {
    super(Account, new Account(), accountInfo);
  }
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

