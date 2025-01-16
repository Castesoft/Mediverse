import { catchError, map, Observable, of, tap } from "rxjs";
import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Role } from "src/app/_models/types";
import { Router } from "@angular/router";
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { UserInsuranceModalComponent } from "src/app/account/modals/user-insurance-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { Account } from 'src/app/_models/account/account';
import { MedicalRecord } from 'src/app/_models/medicalRecords/medicalRecord';
import { Payment } from 'src/app/_models/payments/payment';
import { SatisfactionSurvey } from 'src/app/_models/satisfactionSurvey';
import {
  UserMedicalInsuranceCompany
} from 'src/app/_models/users/userMedicalInsuranceCompany/userMedicalInsuranceCompany';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { BillingDetails, UserAddress, UserPaymentMethod } from 'src/app/_models/billingDetails';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private snackBar = inject(MatSnackBar);
  private matDialog = inject(MatDialog);

  baseUrl = `${environment.apiUrl}account/`;

  current = signal<Account | null>(null);
  billingDetails = signal<BillingDetails | null>(null);
  userPaymentHistory = signal<Payment[]>([]);
  roles = computed(() => {
    const user = this.current();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [ role ];
    }
    return [];
  });
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*@$¡!%*¿?&.,_-]).{8,}$/;
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  phonePattern: string = '^[0-9]+$';

  login(value: any) {
    return this.http.post<Account>(`${this.baseUrl}login`, value).pipe(
      map(response => {
        if (response) {
          if (!response.requiresTwoFactor) {
            this.setCurrentUser(response);
            this.snackbarService.success(`Bienvenido ${response.firstName}!`);
          }
        }
        return response;
      })
    );
  }

  setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.current.set(user);
    this.getCurrent().subscribe({
      next: response => {
        // console.log('response', response);
        this.current.set(response);
      }
    });
  }

  private getCurrent(): Observable<Account> {
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
          this.snackbarService.success(`Bienvenido ${response.firstName}!`);
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
          this.snackbarService.success(`Bienvenido ${response.firstName}!`);
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
        this.snackbarService.success(`Cuenta de ${provider} vinculada correctamente`);
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
        this.snackbarService.success('Autenticación de dos factores habilitada correctamente');
      })
    );
  }

  disableTwoFactorAuth() {
    return this.http.delete(`${this.baseUrl}two-factor`).pipe(
      tap(() => {
        this.setCurrentUser({ ...this.current()!, twoFactorEnabled: false });
        this.snackbarService.success('Autenticación de dos factores deshabilitada correctamente');
      })
    );
  }

  hasRole = (inputRoles: Role[]): boolean => {
    if (this.roles().some((role => inputRoles.includes(role)))) return true;
    return false;
  }

  getFormFields() {
    return this.http.get<any>(`${this.baseUrl}register-doctor-fields`);
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
    if (this.billingDetails() !== null) return;

    this.http.get<BillingDetails>(`${this.baseUrl}billing-details`).subscribe({
      next: billingDetails => {
        this.billingDetails.set(billingDetails);
      }
    });
  }

  addPaymentMethod(value: any) {
    return this.http.post<UserPaymentMethod>(`${this.baseUrl}payment-method`, value).pipe(
      map(newPaymentMehod => {
        this.snackbarService.success('Método de pago añadido correctamente');
        if (newPaymentMehod.isMain) {
          const paymentMethods = this.billingDetails()?.userPaymentMethods || [];
          paymentMethods.forEach(pm => pm.isMain = false);
          paymentMethods.push(newPaymentMehod as UserPaymentMethod);
          this.billingDetails.set({
            userAddresses: this.billingDetails()?.userAddresses || [],
            userPaymentMethods: paymentMethods
          });
        } else {
          this.billingDetails.set({
            userAddresses: this.billingDetails()?.userAddresses || [],
            userPaymentMethods: [ ...this.billingDetails()?.userPaymentMethods || [], newPaymentMehod as UserPaymentMethod ]
          });
        }
      }),
      catchError(_ => {
        this.snackbarService.error('Error al añadir el método de pago');
        return of(null);
      })
    );
  }

  deletePaymentMethod(id: string) {
    return this.http.delete(`${this.baseUrl}payment-method/${id}`).pipe(
      tap(() => {
        this.snackbarService.success('Método de pago eliminado correctamente');
        this.billingDetails.set({
          userAddresses: this.billingDetails()?.userAddresses || [],
          userPaymentMethods: this.billingDetails()?.userPaymentMethods?.filter(pm => pm.stripePaymentMethodId !== id) || []
        });
      })
    );
  }

  setMainPaymentMethod(id: string) {
    return this.http.put(`${this.baseUrl}payment-method/${id}`, {}).pipe(
      tap(() => {
        this.snackbarService.success('Método de pago principal actualizado correctamente');
        const paymentMethods = this.billingDetails()?.userPaymentMethods || [];
        paymentMethods.forEach(pm => pm.isMain = pm.stripePaymentMethodId === id);
        this.billingDetails.set({
          userAddresses: this.billingDetails()?.userAddresses || [],
          userPaymentMethods: paymentMethods.sort((a, b) => a.isMain ? -1 : 1)
        });
      })
    );
  }

  addAddress(value: any) {
    return this.http.post<UserAddress>(`${this.baseUrl}address`, value).pipe(
      map(newAddress => {
        this.snackbarService.success('Dirección añadida correctamente');
        if (newAddress.isBilling) {
          const addresses = this.billingDetails()?.userAddresses || [];
          addresses.forEach(a => a.isBilling = false);
          addresses.push(newAddress as UserAddress);
          this.billingDetails.set({
            userAddresses: addresses.sort((a, b) => a.isBilling ? -1 : 1),
            userPaymentMethods: this.billingDetails()?.userPaymentMethods || []
          });
        } else {
          this.billingDetails.set({
            userAddresses: [ ...this.billingDetails()?.userAddresses || [], newAddress as UserAddress ],
            userPaymentMethods: this.billingDetails()?.userPaymentMethods || []
          });
        }
      })
    );
  }

  deleteAddress(id: number) {
    return this.http.delete(`${this.baseUrl}address/${id}`).pipe(
      tap(() => {
        this.snackbarService.success('Dirección eliminada correctamente');
        this.billingDetails.set({
          userAddresses: this.billingDetails()?.userAddresses?.filter(a => a.id !== id) || [],
          userPaymentMethods: this.billingDetails()?.userPaymentMethods || []
        });
      })
    );
  }

  updateAddress(id: number, value: any) {
    return this.http.put<UserAddress>(`${this.baseUrl}address/${id}`, value).pipe(
      tap(_ => {
        this.snackbarService.success('Dirección actualizada correctamente');
        let addresses = this.billingDetails()?.userAddresses || [];
        if (value.IsBilling) {
          addresses.forEach(a => a.isBilling = false);
        }
        addresses = addresses.map(a => a.id === id ? new UserAddress({
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
        }) : a);
        this.billingDetails.set({
          userAddresses: addresses.sort((a, b) => a.isBilling ? -1 : 1),
          userPaymentMethods: this.billingDetails()?.userPaymentMethods || []
        });
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
        this.snackbarService.success('Póliza de seguro eliminada correctamente');
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
        this.snackbarService.success('El documento de la póliza de seguro ha sido eliminado correctamente');
      })
    );
  }

  addMedicalInsurance(value: FormData) {
    return this.http.post<Account>(`${this.baseUrl}medical-insurance-company`, value).pipe(
      tap(response => {
        this.current.set(response);
        this.snackBar.open('Póliza de seguro añadida correctamente', 'Cerrar', { duration: 5000 });
      })
    );
  }

  updateMedicalInsurance(model: any) {
    return this.http.put<Account>(`${this.baseUrl}medical-insurance-company`, model).pipe(
      tap(response => {
        this.current.set(response);
        this.snackBar.open('Póliza de seguro actualizada correctamente', 'Cerrar', { duration: 5000 });
      })
    );
  }

  toggleDoctorInsurance(insuranceId: number, isActive: boolean): Observable<Account> {
    let params = new HttpParams();

    params = params.append('insuranceId', insuranceId.toString());
    params = params.append('isActive', isActive);

    // console.log('params', params);

    return this.http.put<Account>(`${this.baseUrl}doctor-medical-insurance-company`, null, { params: params, }).pipe(
      tap(account => {
        this.snackBar.open('Póliza de seguro actualizada correctamente', 'Cerrar', { duration: 5000 });
        this.current.set(account);
      }),
    );
  }

  getPaymentHistory() {
    return this.http.get<Payment[]>(`${this.baseUrl}payment-history`).pipe(
      tap(payments => {
        this.userPaymentHistory.set(payments);
      })
    );
  }

  setDoctorBanner(value: any) {
    return this.http.put<Account>(`${this.baseUrl}doctor-banner`, value).pipe(
      map(response => {
        this.snackbarService.success('Banner actualizado correctamente');
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  changeEmail(value: any) {
    return this.http.put<Account>(`${this.baseUrl}email`, value).pipe(
      map(response => {
        this.snackbarService.success('Email cambiado correctamente');
        this.setCurrentUser(response);
        return response;
      })
    );
  }

  setPassword(value: any) {
    return this.http.put<Account>(`${this.baseUrl}set-password`, value).pipe(
      map(response => {
        this.snackbarService.success('Contraseña establecida correctamente');
        this.setCurrentUser({ ...this.current()!, linkedEmail: true });
        return response;
      })
    );
  }

  changePassword(value: any) {
    return this.http.put<Account>(`${this.baseUrl}password`, value).pipe(
      map(response => {
        this.snackbarService.success('Contraseña cambiada correctamente');
        return response;
      })
    );
  }

  updateAccountDetails(value: any) {
    return this.http.put<Account>(`${this.baseUrl}account-details`, value).pipe(
      map(response => {
        this.snackbarService.success('Detalles del perfil actualizados correctamente');
        this.setCurrentUser(response);
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
      map(response => {
        this.snackbarService.success('Horario de trabajo actualizado correctamente');
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
        this.snackbarService.success('Historial clínico actualizado correctamente');
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
        this.snackbarService.success('Revisión enviada correctamente');
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
    this.billingDetails.set(null);
    this.router.navigate([ '/' ]);
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

  termsAndConditionsValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : { termsAndConditions: true };
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
