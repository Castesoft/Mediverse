import { Observable, map, tap } from "rxjs";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Account } from "src/app/_models/account";
import { Role } from "src/app/_models/types";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = `${environment.apiUrl}account/`;
  current = signal<Account | null>(null);
  roles = computed<Role[]>(() => {

    const user = this.current();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      const roles = Array.isArray(role) ? role : [role];
      user.roles = roles;
      return roles;
    }
    return [];
  })

  private http = inject(HttpClient);
  private router = inject(Router);
  private matSnackBar = inject(MatSnackBar);

  login(value: any) {
    return this.http.post<Account>(`${this.baseUrl}login`, value).pipe(
      map(response => {
        if (response) {
          this.setCurrentUser(response);
          this.router.navigate(['/account']);
          this.matSnackBar.open(`Bienvenido ${response.firstName}`, 'Cerrar', { duration: 3000 });
        }
        return response;
      })
    );
  }

  hasRole = (inputRoles: Role[]): boolean => {
    if (this.roles().some((role => inputRoles.includes(role)))) return true;
    return false;
  }

  register(value: any) {
    return this.http.post<Account>(`${this.baseUrl}register`, value).pipe(
      map(response => {
        response && this.setCurrentUser(response);
        return response;
      })
    );
  }

  setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.current.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.current.set(null);
    this.router.navigate(['/auth/sign-in/basic']);
  }

  update(value: any) {
    return this.http.put<Account>(`${this.baseUrl}`, value).pipe(
      map(response => {
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  delete(requiredText: string) {
    return this.http.delete(`${this.baseUrl}${requiredText}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }

  getDecodedToken = (token: string) => JSON.parse(atob(token.split('.')[1]));

  updatePassword(passwordUpdate: any): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}password-update`,
      passwordUpdate
    );
  }

  deleteProfilePicture() {
    return this.http.delete<Account>(`${this.baseUrl}profile-picture`).pipe(
      map((response) => {
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  resetPasswordWithToken(
    token: string,
    password: string,
    email: string
  ): Observable<any> {
    const url = `${this.baseUrl}reset-password-with-token`;
    const body = { token: token, password: password, email: email };
    return this.http.put<any>(url, body);
  }

  verifyEmail(email: string, code: string) {
    return this.http
      .post<Account>(`${this.baseUrl}email-verification`, {
        email: email,
        code: code,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  sendPhoneVerificationCode(
    email: string,
    phoneNumber: string,
    phoneNumberCountryCode: string
  ) {
    const body = {
      email: email,
      phoneNumber: phoneNumber,
      phoneNumberCountryCode: phoneNumberCountryCode,
    };
    return this.http.post(`${this.baseUrl}send-phone-verification-code`, body);
  }


  verifyPhoneNumber(email: string, code: string) {
    const body = {
      email: email,
      code: code,
    };
    return this.http
      .post<Account>(`${this.baseUrl}phone-verification`, body)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          this.setCurrentUser(response);
          return response;
        })
      );
  }

  updateEmail(email: string) {
    return this.http
      .put<Account>(`${this.baseUrl}update-email`, { email: email })
      .pipe(
        map(response => {
          this.setCurrentUser(response);
          return response;
        })
      );
  }

  updatePhoneNumber(
    phoneNumber: string,
    phoneNumberCountryCode: string
  ) {
    const body = {
      phoneNumber: phoneNumber,
      phoneNumberCountryCode: phoneNumberCountryCode,
    };

    return this.http
      .put<Account>(`${this.baseUrl}update-phoneNumber`, body)
      .pipe(
        map(response => {
          this.setCurrentUser(response);
          return response;
        })
      );
  }

  sendEmailForPasswordReset = (email: string) =>
    this.http.get<Account>(
      `${this.baseUrl}request-password-reset-token/${email}`
    );
  checkEmailExists = (email: string): Observable<boolean> =>
    this.http.get<boolean>(this.baseUrl + 'emailExists?email=' + email);
  checkPhoneNumberExists = (phoneNumber: string): Observable<boolean> =>
    this.http.get<boolean>(
      `${this.baseUrl}phoneNumberExists?phoneNumber=${phoneNumber}`
    );
  checkUsernameExists = (username: string): Observable<boolean> =>
    this.http.get<boolean>(
      `${this.baseUrl}usernameExists?username=${username}`
    );
  resendEmailVerificationCode = () =>
    this.http.get(`${this.baseUrl}resend-email-verification`);
  resendPhoneNumberVerificationCode = () =>
    this.http.get(`${this.baseUrl}resend-phone-verification`);

}
