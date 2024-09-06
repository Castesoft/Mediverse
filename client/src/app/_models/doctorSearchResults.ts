import { HttpParams } from '@angular/common/http';
import { Specialty } from './specialty';
import { getPaginationHeaders } from '../_utils/util';
import { PaymentMethodType } from './paymentMethodType';
import { MedicalInsuranceCompany } from './medicalInsuranceCompany';
import { Service } from './service';
import { Address } from '../addresses/addresses.config';

export interface DoctorSearchResults {
    doctors: DoctorSearchResult[];
    latitude: number;
    longitude: number;
}

export interface DoctorSearchResult {
    id: number;
    firstName: string;
    lastName: string;
    title: any;
    specialties: Specialty[];
    addresses: Address[];
    paymentMethods: PaymentMethodType[];
    requireAnticipatedCardPayments: boolean;
    services: Service[];
    medicalInsuranceCompanies: MedicalInsuranceCompany[];
    doctorAvailabilities: DoctorAvailability[];
    reviews: DoctorReview[];
    photoUrl: string;
    email: string;
    phoneNumber: string;
    hasPatientInformationAccess: boolean;
}

export interface DoctorReview {
    rating: number;
    comment: string;
    userName: string;
    userPhotoUrl: string;
    createdAt: Date;
}

export interface DoctorAvailability {
    day: string;
    dayNumber: number;
    month: string;
    monthNumber: number;
    year: number;
    availability: DoctorAvailabilityTime[];
}

interface DoctorAvailabilityTime {
    start: string;
    end: string;
    available: boolean;
}

export class DoctorSearchResultParams {
    pageNumber = 1;
    pageSize = 5;
    specialty?: string;
    location?: string;

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
