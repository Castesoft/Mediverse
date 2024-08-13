import { Observable, map, of, tap } from "rxjs";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Account } from "src/app/_models/account";
import { Role } from "src/app/_models/types";
import { Router } from "@angular/router";
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { SnackbarService } from './snackbar.service';
import { BillingDetails, UserAddress, UserPaymentMethod } from '../_models/billingDetails';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = `${environment.apiUrl}account/`;
  current = signal<Account | null>(null);
  billingDetails = signal<BillingDetails | null>(null);
  roles = computed<Role[]>(() => {

    const user = this.current();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      const roles = Array.isArray(role) ? role : [role];
      user.roles = roles;
      return roles;
    }
    return [];
  });
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*@$¡!%*¿?&.,_-]).{8,}$/;
  emailPattern:string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  phonePattern: string = '^[0-9]+$';

  private http = inject(HttpClient);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  login(value: any) {
    return this.http.post<Account>(`${this.baseUrl}login`, value).pipe(
      map(response => {
        if (response) {
          this.setCurrentUser(response);
          this.router.navigate(['/account']);
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
          this.router.navigate(['/account']);
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
            userPaymentMethods: paymentMethods.sort((a, b) => a.isMain ? -1 : 1)
          });
        } else {
          this.billingDetails.set({
            userAddresses: this.billingDetails()?.userAddresses || [],
            userPaymentMethods: [...this.billingDetails()?.userPaymentMethods || [], newPaymentMehod as UserPaymentMethod]
          });
        }
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
            userAddresses: [...this.billingDetails()?.userAddresses || [], newAddress as UserAddress],
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
          userAddresses: this.billingDetails()?.userAddresses?.filter(a => a.addressId !== id) || [],
          userPaymentMethods: this.billingDetails()?.userPaymentMethods || []
        });
      })
    );
  }

  updateAddress(id:number, value: any) {
    return this.http.put<UserAddress>(`${this.baseUrl}address/${id}`, value).pipe(
      tap(_ => {
        this.snackbarService.success('Dirección actualizada correctamente');
        let addresses = this.billingDetails()?.userAddresses || [];
        if (value.IsBilling) {
          addresses.forEach(a => a.isBilling = false);
        }
        addresses = addresses.map(a => a.addressId === id ? {
          addressId: id,
          isMain: value.IsMain,
          isBilling: value.IsBilling,
          street: value.Address,
          city: value.City,
          state: value.State,
          country: value.Country,
          zipcode: value.ZipCode
        } : a);
        this.billingDetails.set({
          userAddresses: addresses.sort((a, b) => a.isBilling ? -1 : 1),
          userPaymentMethods: this.billingDetails()?.userPaymentMethods || []
        });
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

  setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.current.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.current.set(null);
    this.router.navigate(['/auth/sign-in']);
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

  equalFields(field1:string, field2:string): ValidationErrors | null {
    return ( formGroup:FormGroup ): ValidationErrors | null => {
        const fieldValue1 = formGroup.get(field1)?.value;
        const fieldValue2 = formGroup.get(field2)?.value;
        if( fieldValue1 !== fieldValue2 ) {
            formGroup.get(field2)?.setErrors({ notEqual:true });
            return { notEqual: true }
        }

        return null;
    }
  }

  termsAndConditionsValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : {termsAndConditions: true};
  }

}
