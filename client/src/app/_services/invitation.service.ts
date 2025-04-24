import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface InvitationAcceptSuccessResponse {
  message: string;
}

export interface InvitationAcceptAuthRequiredResponse {
  requiresAuthentication: true;
  token: string;
  message: string;
}

export interface InvitationDetailsResponse {
  isValid: boolean;
  message?: string;
  invitingDoctor: InvitingDoctorSummary | null;
  roleInvitedAs: string | null;
}

export interface InvitingDoctorSummary {
  id: number;
  fullName: string;
  photoUrl: string | null;
  mainSpecialty: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl + 'invitations';

  /**
   * Attempts to accept an invitation using the provided token.
   * Handles different response types including success, auth required, and errors.
   * @param token The invitation token.
   * @returns Observable of the success response or the auth required response. Throws HttpErrorResponse on other errors.
   */
  acceptInvitation(token: string): Observable<InvitationAcceptSuccessResponse | InvitationAcceptAuthRequiredResponse> {
    const payload = { token };
    return this.http.post<InvitationAcceptSuccessResponse | InvitationAcceptAuthRequiredResponse>(`${this.baseUrl}/accept`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getInvitationDetails(token: string): Observable<InvitationDetailsResponse> {
    return this.http.get<InvitationDetailsResponse>(`${this.baseUrl}/details/${token}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Error fetching invitation details:", error);
          return throwError(() => ({
            isValid: false,
            message: error.error?.message || error.message || 'Error al obtener detalles de la invitación.',
            invitingDoctor: null,
            roleInvitedAs: null
          } as InvitationDetailsResponse));
        })
      );
  }

}
