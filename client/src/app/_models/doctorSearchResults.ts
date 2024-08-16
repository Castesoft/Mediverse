import { HttpParams } from '@angular/common/http'
import { Address } from './address'
import { Specialty } from './specialty'
import { getPaginationHeaders } from '../_utils/util'

export interface DoctorSearchResults {
    doctors: DoctorSearchResult[];
    latitude: number;
    longitude: number;
}

export interface DoctorSearchResult {
    firstName: string;
    lastName: string;
    title: any;
    specialties: Specialty[];
    addresses: Address[];
    photoUrl: string;
    email: string;
    phoneNumber: string;
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