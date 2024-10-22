import { Specialty } from './specialty';
import { PaymentMethodType } from './paymentMethodType';
import { MedicalInsuranceCompany } from './medicalInsuranceCompany';
import { Address } from '../addresses/addresses.config';
import { Account } from 'src/app/_models/account';
import { Service } from 'src/app/services/services.config';

export class SearchResults {
  doctors: DoctorResult[] = [];
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(init?: Partial<SearchResults>) {
    Object.assign(this, init);
  }
}

export class DoctorResult {
  id: number | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  title: any;
  specialties: Specialty[] = [];
  addresses: Address[] = [];
  paymentMethods: PaymentMethodType[] = [];
  requireAnticipatedCardPayments: boolean = false;
  services: Service[] = [];
  medicalInsuranceCompanies: MedicalInsuranceCompany[] = [];
  doctorAvailabilities: DoctorAvailability[] = [];
  reviews: DoctorReview[] = [];
  photoUrl: string | null = null;
  email: string | null = null;
  phoneNumber: string | null = null;
  hasPatientInformationAccess: boolean = false;

  constructor(init?: Partial<DoctorResult>) {
    Object.assign(this, init);
  }
}

export class DoctorReview {
  rating: number | null = null;
  comment: string | null = null;
  createdAt: Date | null = null;
  account: Account = new Account();

  constructor(init?: Partial<DoctorReview>) {
    Object.assign(this, init);
  }
}

export class DoctorAvailability {
  day: string | null = null;
  dayNumber: number | null = null;
  month: string | null = null;
  monthNumber: number | null = null;
  year: number | null = null;
  availability: DoctorAvailabilityTime[] = [];

  constructor(init?: Partial<DoctorAvailability>) {
    Object.assign(this, init);
  }
}

class DoctorAvailabilityTime {
  start: string | null = null;
  end: string | null = null;
  available: boolean = false;

  constructor(init?: Partial<DoctorAvailabilityTime>) {
    Object.assign(this, init);
  }
}
