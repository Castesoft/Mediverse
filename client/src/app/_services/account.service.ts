import { BehaviorSubject, catchError, map, Observable, of, tap } from "rxjs";
import { computed, inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Role } from "src/app/_models/types";
import { Router } from "@angular/router";
import { FormGroup, ValidationErrors } from '@angular/forms';
import { UserInsuranceModalComponent } from "src/app/account/modals/user-insurance-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { Account } from 'src/app/_models/account/account';
import { MedicalRecord } from 'src/app/_models/medicalRecords/medicalRecord';
import { Payment } from 'src/app/_models/payments/payment';
import { SatisfactionSurvey } from 'src/app/_models/satisfactionSurvey';
import {
  UserMedicalInsuranceCompany
} from 'src/app/_models/users/userMedicalInsuranceCompany/userMedicalInsuranceCompany';
import { BillingDetails, UserAddress } from 'src/app/_models/billingDetails';
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { ToastrService } from "ngx-toastr";


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private toastr: ToastrService = inject(ToastrService);
  private matDialog: MatDialog = inject(MatDialog);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  baseUrl: string = `${environment.apiUrl}account/`;

  current: WritableSignal<Account | null> = signal<Account | null>(null);

  private billingDetailsSubject: BehaviorSubject<BillingDetails | null> = new BehaviorSubject<BillingDetails | null>(null);
  billingDetails$: Observable<BillingDetails | null> = this.billingDetailsSubject.asObservable();

  private activeSubscriptionSubject: BehaviorSubject<Subscription | null> = new BehaviorSubject<Subscription | null>(null);
  activeSubscription$: Observable<Subscription | null> = this.activeSubscriptionSubject.asObservable();

  userPaymentHistory: WritableSignal<Payment[]> = signal<Payment[]>([]);
  roles: Signal<any[]> = computed(() => {
    const user: Account | null = this.current();
    if (user && user.token) {
      const role: any = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [ role ];
    }
    return [];
  });

  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*@$¡!%*¿?&.,_-]).{8,}$/;
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  phonePattern: string = '^[0-9]+$';

  login(value: any) {
    return this.http.post<Account>(`${this.baseUrl}login`, value).pipe(
      map((response: Account) => {
        if (!response.requiresTwoFactor) {
          this.setCurrentUser(response);
        }

        return response;
      })
    );
  }

  updateActiveSubscriptionStatus(): Observable<Subscription | null> {
    return this.http.get<Subscription | null>(`${this.baseUrl}active-subscription`).pipe(
      tap((subscription: Subscription | null) => this.activeSubscriptionSubject.next(subscription)),
      catchError((err: any) => {
        console.error("Error retrieving active subscription", err);
        this.activeSubscriptionSubject.next(null);
        return of(null);
      })
    );
  }

  refreshActiveSubscriptionStatus(): void {
    this.updateActiveSubscriptionStatus().subscribe();
  }

  setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.current.set(user);
    //
    // this.getCurrent().subscribe({
    //   next: response => {
    //     this.current.set(response);
    //   }
    // });
    this.refreshActiveSubscriptionStatus();
  }

  getCurrent(): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}`).pipe(
      map(response => {
        return response;
      })
    )
  }

  updateCurrentUser() {
    this.http.get<Account>(`${this.baseUrl}current`).subscribe({
      next: user => {
        this.setCurrentUser(user);
      }
    });
  }

  twoFactorLogin(email: string, verificationCode: string) {
    return this.http.post<Account>(`${this.baseUrl}login-two-factor`, {
      email,
      verificationCode
    }, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.setCurrentUser(response);
          this.toastr.success(`Bienvenido ${response.firstName}!`);
        }
        return response;
      })
    );
  }

  loginWithSocialAuth(provider: string, token: string) {
    return this.http.post<Account>(`${this.baseUrl}login-social`, { provider, accessToken: token }).pipe(
      map(response => {
        if (response) {
          this.setCurrentUser(response);
          this.toastr.success(`Bienvenido ${response.firstName}!`);
        }
        return response;
      })
    );
  }

  linkSocialAccount(provider: string, token: string) {
    return this.http.put(`${this.baseUrl}link-social`, { provider, accessToken: token }).pipe(
      tap(_ => {
        if (provider === 'GOOGLE') {
          this.setCurrentUser({ ...this.current()!, linkedGoogle: true });
        }
        this.toastr.success(`Cuenta de ${provider} vinculada correctamente`);
      })
    );
  }

  getTwoFactorSetupInfo() {
    return this.http.get(`${this.baseUrl}two-factor-setup`);
  }

  enableTwoFactorAuth(verificationCode: string) {
    return this.http.post(`${this.baseUrl}two-factor-verify`, { verificationCode }).pipe(
      tap(() => {
        this.setCurrentUser({ ...this.current()!, twoFactorEnabled: true });
        this.toastr.success('Autenticación de dos factores habilitada correctamente');
      })
    );
  }

  disableTwoFactorAuth() {
    return this.http.delete(`${this.baseUrl}two-factor`).pipe(
      tap(() => {
        this.setCurrentUser({ ...this.current()!, twoFactorEnabled: false });
        this.toastr.success('Autenticación de dos factores deshabilitada correctamente');
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

  registerDoctor(value: any) {
    return this.http.post<Account>(`${this.baseUrl}register-doctor`, value).pipe(
      map(response => {
        response && this.setCurrentUser(response);
        return response;
      })
    );
  }

  getBillingDetails() {
    this.http.get<BillingDetails>(`${this.baseUrl}billing-details`).subscribe({
      next: billingDetails => {
        this.billingDetailsSubject.next(billingDetails);
      }
    });
  }

  addPaymentMethod(value: any) {
    return this.http.post<PaymentMethod>(`${this.baseUrl}payment-method`, value).pipe(
      map(newPaymentMethod => {
        this.toastr.success('Método de pago añadido correctamente');
        const currentDetails = this.billingDetailsSubject.getValue();
        if (currentDetails) {
          let updatedPaymentMethods = [ ...currentDetails.userPaymentMethods ];
          if (newPaymentMethod.isDefault) {
            updatedPaymentMethods.forEach(pm => pm.isDefault = false);
          }
          updatedPaymentMethods.push(newPaymentMethod);
          const updatedBillingDetails: BillingDetails = {
            ...currentDetails,
            userPaymentMethods: updatedPaymentMethods
          };
          this.billingDetailsSubject.next(updatedBillingDetails);
        }
      }),
      catchError(_ => {
        this.toastr.error('Error al añadir el método de pago');
        return of(null);
      })
    );
  }

  deletePaymentMethod(id: string) {
    return this.http.delete(`${this.baseUrl}payment-method/${id}`).pipe(
      tap(() => {
        this.toastr.success('Método de pago eliminado correctamente');
        const currentDetails = this.billingDetailsSubject.getValue();
        if (currentDetails) {
          const updatedPaymentMethods = currentDetails.userPaymentMethods.filter(
            pm => pm.stripePaymentMethodId !== id
          );
          const updatedBillingDetails: BillingDetails = {
            ...currentDetails,
            userPaymentMethods: updatedPaymentMethods
          };
          this.billingDetailsSubject.next(updatedBillingDetails);
        }
      })
    );
  }

  setMainPaymentMethod(id: string) {
    return this.http.put(`${this.baseUrl}payment-method/${id}`, {}).pipe(
      tap(() => {
        this.toastr.success('Método de pago principal actualizado correctamente');
        const currentDetails = this.billingDetailsSubject.getValue();
        if (currentDetails) {
          const updatedPaymentMethods = currentDetails.userPaymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.stripePaymentMethodId === id
          })).sort((a, b) => a.isDefault ? -1 : 1);
          const updatedBillingDetails: BillingDetails = {
            ...currentDetails,
            userPaymentMethods: updatedPaymentMethods
          };
          this.billingDetailsSubject.next(updatedBillingDetails);
        }
      })
    );
  }

  addAddress(value: any) {
    return this.http.post<UserAddress>(`${this.baseUrl}address`, value).pipe(
      map(newAddress => {
        this.toastr.success('Dirección añadida correctamente');
        const currentDetails = this.billingDetailsSubject.getValue();
        if (currentDetails) {
          let updatedAddresses = [ ...currentDetails.userAddresses ];
          if (newAddress.isBilling) {
            // Reset billing flag on all addresses
            updatedAddresses.forEach(a => a.isBilling = false);
          }
          updatedAddresses.push(newAddress);
          const updatedBillingDetails: BillingDetails = {
            ...currentDetails,
            userAddresses: updatedAddresses.sort((a, b) => a.isBilling ? -1 : 1)
          };
          this.billingDetailsSubject.next(updatedBillingDetails);
        }
      })
    );
  }

  deleteAddress(id: number) {
    return this.http.delete(`${this.baseUrl}address/${id}`).pipe(
      tap(() => {
        this.toastr.success('Dirección eliminada correctamente');
        const currentDetails = this.billingDetailsSubject.getValue();
        if (currentDetails) {
          const updatedAddresses = currentDetails.userAddresses.filter(a => a.id !== id);
          const updatedBillingDetails: BillingDetails = {
            ...currentDetails,
            userAddresses: updatedAddresses
          };
          this.billingDetailsSubject.next(updatedBillingDetails);
        }
      })
    );
  }

  updateAddress(id: number, value: any) {
    return this.http.put<UserAddress>(`${this.baseUrl}address/${id}`, value).pipe(
      tap(_ => {
        this.toastr.success('Dirección actualizada correctamente');
        const currentDetails = this.billingDetailsSubject.getValue();
        if (currentDetails) {
          let addresses = [ ...currentDetails.userAddresses ];
          if (value.IsBilling) {
            // Reset billing flag on all addresses
            addresses.forEach(a => a.isBilling = false);
          }
          addresses = addresses.map(a =>
            a.id === id ? new UserAddress({
              id: id,
              isMain: value.IsMain,
              isBilling: value.IsBilling,
              street: value.Street,
              city: value.City,
              state: value.State,
              country: value.Country,
              zipcode: value.Zipcode,
              neighborhood: value.Neighborhood,
              exteriorNumber: value.ExteriorNumber,
              interiorNumber: value.InteriorNumber
            }) : a
          );
          const updatedBillingDetails: BillingDetails = {
            ...currentDetails,
            userAddresses: addresses.sort((a, b) => a.isBilling ? -1 : 1)
          };
          this.billingDetailsSubject.next(updatedBillingDetails);
        }
      })
    );
  }

  deleteMedicalInsurance(id: number) {
    this._deleteMedicalInsurance(id).subscribe();
  }

  private _deleteMedicalInsurance(id: number): Observable<Account> {
    return this.http.delete<Account>(`${this.baseUrl}medical-insurance-company/${id}`).pipe(
      tap(response => {
        this.current.set(response);
        this.toastr.success('Póliza de seguro eliminada correctamente');
      })
    );
  }

  deleteMedicalInsuranceDocument(id: number) {
    this._deleteMedicalInsuranceDocument(id).subscribe();
  }

  private _deleteMedicalInsuranceDocument(id: number): Observable<Account> {
    return this.http.delete<Account>(`${this.baseUrl}medical-insurance-company-document/${id}`).pipe(
      tap(response => {
        this.current.set(response);
        this.toastr.success('El documento de la póliza de seguro ha sido eliminado correctamente');
      })
    );
  }

  addMedicalInsurance(value: FormData) {
    return this.http.post<Account>(`${this.baseUrl}medical-insurance-company`, value).pipe(
      tap((response: Account) => {
        this.current.set(response);
        this.toastr.success('Póliza de seguro añadida correctamente');
      })
    );
  }

  updateMedicalInsurance(model: any) {
    return this.http.put<Account>(`${this.baseUrl}medical-insurance-company`, model).pipe(
      tap((response: Account) => {
        this.current.set(response);
        this.toastr.success('Póliza de seguro actualizada correctamente');
      })
    );
  }

  toggleDoctorInsurance(insuranceId: number, isActive: boolean): Observable<Account> {
    let params: HttpParams = new HttpParams();

    params = params.append('insuranceId', insuranceId.toString());
    params = params.append('isActive', isActive);

    return this.http.put<Account>(`${this.baseUrl}doctor-medical-insurance-company`, null, { params: params, }).pipe(
      tap((account: Account) => {
        this.toastr.success('Póliza de seguro actualizada correctamente');
        this.setCurrentUser(account);
      }),
    );
  }

  getPaymentHistory() {
    return this.http.get<Payment[]>(`${this.baseUrl}payment-history`).pipe(
      tap((payments: Payment[]) => {
        this.userPaymentHistory.set(payments);
      })
    );
  }

  setDoctorBanner(value: any) {
    return this.http.put<Account>(`${this.baseUrl}doctor-banner`, value).pipe(
      map((response: Account) => {
        this.toastr.success('Banner actualizado correctamente');
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  changeEmail(value: any) {
    return this.http.put<Account>(`${this.baseUrl}email`, value).pipe(
      map((response: Account) => {
        this.toastr.success('Email cambiado correctamente');
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  setPassword(value: any) {
    return this.http.put<Account>(`${this.baseUrl}set-password`, value).pipe(
      map((response: Account) => {
        this.toastr.success('Contraseña establecida correctamente');
        this.setCurrentUser({ ...this.current()!, linkedEmail: true });
        return response;
      })
    );
  }

  changePassword(value: any) {
    return this.http.put<Account>(`${this.baseUrl}password`, value).pipe(
      map((response: Account) => {
        this.toastr.success('Contraseña cambiada correctamente');
        return response;
      })
    );
  }

  updateAccountDetails(value: any) {
    return this.http.put<Account>(`${this.baseUrl}account-details`, value).pipe(
      map((response: Account) => {
        console.log('update account details response', response);
        this.toastr.success('Detalles del perfil actualizados correctamente');
        this.setCurrentUser({ ...this.current(), ...response });
        return response;
      })
    );
  }

  updateWorkSchedule(workScheduleBlocks: any, startTime: string, endTime: string, minutesPerBlock: number) {
    return this.http.post<Account>(`${this.baseUrl}work-schedule`, {
      workScheduleBlocks,
      startTime,
      endTime,
      minutesPerBlock
    }).pipe(
      map((response: Account) => {
        this.toastr.success('Horario de trabajo actualizado correctamente');
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  getMedicalRecord() {
    return this.http.get<MedicalRecord>(`${this.baseUrl}medical-record`);
  }

  updateMedicalRecord(value: any) {
    return this.http.put<MedicalRecord>(`${this.baseUrl}medical-record`, value).pipe(
      map(response => {
        this.toastr.success('Historial clínico actualizado correctamente');
        return response;
      })
    );
  }

  getSatisfactionSurveys() {
    return this.http.get<SatisfactionSurvey[]>(`${this.baseUrl}satisfaction-surveys`);
  }

  submitReview(value: any) {
    return this.http.post<SatisfactionSurvey>(`${this.baseUrl}review`, value).pipe(
      map(response => {
        this.toastr.success('Revisión enviada correctamente');
        return response;
      })
    );
  }

  skipSatisfactionSurvey(eventId: number) {
    return this.http.post(`${this.baseUrl}review/skip/${eventId}`, {});
  }

  logout() {
    localStorage.removeItem('user');
    this.current.set(null);
    this.billingDetailsSubject.next(null);
    this.router.navigate([ '/' ]).then(() => {});
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
          response.token && localStorage.setItem('token', response.token);
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

  equalFields(field1: string, field2: string): ValidationErrors | null {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;
      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }

      return null;
    }
  }

  clickInsuranceCompany(item: UserMedicalInsuranceCompany | null = null, use: FormUse = FormUse.DETAIL, view: View) {

    if (view === "modal") {
      this.matDialog.open(UserInsuranceModalComponent, {
        data: { item: item, use: use, view: 'modal', },
        maxWidth: '500px',
        panelClass: 'bg-body'
      });
    }
  };

}
