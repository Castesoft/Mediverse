import { HttpParams } from '@angular/common/http';
import { Specialty } from './specialty';
import { getPaginationHeaders } from '../_utils/util';
import { PaymentMethodType } from './paymentMethodType';
import { MedicalInsuranceCompany } from './medicalInsuranceCompany';
import { Service } from './service';
import { Address } from '../addresses/addresses.config';
import { Account } from 'src/app/_models/account';

export class DoctorSearchResults {
  doctors: DoctorSearchResult[] = [];
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(init?: Partial<DoctorSearchResults>) {
    Object.assign(this, init);
  }
}

export class DoctorSearchResult {
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

  constructor(init?: Partial<DoctorSearchResult>) {
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

export class DoctorSearchResultParams {
    pageNumber = 1;
    pageSize = 5;
    specialty?: string | null = null;
    location?: string | null = null;

    constructor(specialty: string, location: string) {
        this.specialty = specialty;
        this.location = location
    }
}

export function DoctorSearchResultParamsToHttpParams(
    params: DoctorSearchResultParams
): HttpParams {
    let httpParams = getPaginationHeaders(params.pageNumber, params.pageSize);

    if (params.specialty) httpParams = httpParams.append('specialty', params.specialty);
    if (params.location) httpParams = httpParams.append('location', params.location);
    if (params.pageSize) httpParams = httpParams.append('pageSize', params.pageSize.toString());

    return httpParams;
}
