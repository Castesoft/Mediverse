import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClinicalHistoryVerification } from "src/app/_models/clinicalHistoryVerification";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ClinicalHistoryConsentService {
  baseUrl: string = `${environment.apiUrl}users/`;

  constructor(private http: HttpClient) {}

  getConsentStatus(doctorId: number, patientId: number): Observable<ClinicalHistoryVerification> {
    return this.http.get<ClinicalHistoryVerification>(
      `${this.baseUrl}clinical-history-verification/patient/${patientId}/doctor/${doctorId}`
    );
  }

  updateConsentStatus(doctorId: number, patientId: number, consent: boolean): Observable<ClinicalHistoryVerification> {
    return this.http.put<ClinicalHistoryVerification>(
      `${this.baseUrl}clinical-history-consent/patient/${patientId}/doctor/${doctorId}`,
      { hasAccess: consent }
    );
  }
}
