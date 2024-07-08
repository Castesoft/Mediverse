import { BehaviorSubject, Observable, catchError, finalize, map, tap } from "rxjs";
import { Account } from "../_models/account";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = `${environment.apiUrl}account/`;

  private current = new BehaviorSubject<Account | null>(null);
  current$ = this.current.asObservable();

  private loaded = new BehaviorSubject<boolean>(false);
  loaded$ = this.loaded.asObservable();

  sendEmailForPasswordReset = (email: string): Observable<Account> =>
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

  constructor(private http: HttpClient) {}

  loadCurrent(token: string): Observable<Account> {
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Account>(`${this.baseUrl}`, { headers }).pipe(
      map((response) => {
        localStorage.setItem('token', response.token);
        this.setCurrent(response);
        return response;
      }),
      catchError((error) => {
        localStorage.removeItem('token');
        this.current.next(null);
        throw error;
      }),
      finalize(() => {
        this.loaded.next(true);
      })
    );
  }

  login(value: any): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}login`, value).pipe(
      map((response) => {
        localStorage.setItem('token', response.token);
        this.setCurrent(response);
        return response;
      })
    );
  }

  register(value: any): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}register`, value).pipe(
      map((response) => {
        return response;
      })
    );
  }

  logout() {
    this.removeFromLocalStorage();
    this.setCurrentToNull();
    this.loaded.next(false);
  }

  setCurrent(account: Account) {
    account.roles = [];
    const roles = this.getDecodedToken(account.token).role;
    Array.isArray(roles) ? (account.roles = roles) : account.roles.push(roles);
    account.permissions = [];
    const permissions = this.getDecodedToken(account.token).role;
    Array.isArray(permissions)
      ? (account.permissions = permissions)
      : account.permissions.push(permissions);
    this.loaded.next(true);
    this.current.next(account);
  }

  update(value: any): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}`, value).pipe(
      map((response) => {
        this.setCurrent(response);
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

  deleteProfilePicture(): Observable<Account> {
    return this.http.delete<Account>(`${this.baseUrl}profile-picture`).pipe(
      map((response) => {
        this.setCurrent(response);
        return response;
      })
    );
  }

  private removeFromLocalStorage(): void {
    localStorage.removeItem('account');
  }

  private setCurrentToNull(): void {
    this.current.next(null);
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

  verifyEmail(email: string, code: string): Observable<Account> {
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

  verifyPhoneNumber(email: string, code: string): Observable<Account> {
    const body = {
      email: email,
      code: code,
    };
    return this.http
      .post<Account>(`${this.baseUrl}phone-verification`, body)
      .pipe(
        map((account) => {
          localStorage.setItem('token', account.token);
          this.setCurrent(account);
          return account;
        })
      );
  }

  updateEmail(email: string): Observable<Account> {
    return this.http
      .put<Account>(`${this.baseUrl}update-email`, { email: email })
      .pipe(
        map((account) => {
          this.setCurrent(account);
          return account;
        })
      );
  }

  updatePhoneNumber(
    phoneNumber: string,
    phoneNumberCountryCode: string
  ): Observable<Account> {
    const body = {
      phoneNumber: phoneNumber,
      phoneNumberCountryCode: phoneNumberCountryCode,
    };

    return this.http
      .put<Account>(`${this.baseUrl}update-phoneNumber`, body)
      .pipe(
        map((account) => {
          this.setCurrent(account);
          return account;
        })
      );
  }
}