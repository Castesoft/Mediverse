import { SelectOption } from "src/app/_models/base/selectOption";
import { Doctor } from "src/app/_models/doctor";
import { DoctorClinic } from "src/app/_models/doctorClinic";
import { MedicalLicense } from "src/app/_models/medicalLicense";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";
import { Role } from "src/app/_models/types";
import { UserMedicalInsuranceCompany } from "src/app/_models/userMedicalInsuranceCompany";
import { WorkSchedule } from "src/app/_models/workSchedule";
import { WorkScheduleSettings } from "src/app/_models/workScheduleSettings";


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
