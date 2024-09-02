import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ZipcodeAddressOption } from '../_models/billingDetails';

@Injectable({
    providedIn: 'root',
})
export class AddressesService {
    baseUrl = `${environment.apiUrl}addresses/`;
    
    private http = inject(HttpClient);

    getAddressesByZipcode(zipcode: string) {
        return this.http.get<ZipcodeAddressOption[]>(`${this.baseUrl}zipcodes/${zipcode}`);
    }
}