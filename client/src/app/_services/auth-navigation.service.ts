import { inject, Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthNavigationService {
  private readonly router: Router = inject(Router);

  readonly SIGN_IN_URL: string = '/auth/sign-in';
  readonly SIGN_UP_URL: string = '/auth/sign-up';
  readonly PASSWORD_RESET_URL: string = '/auth/sign-in/password-reset';

  navigateToSignIn(queryParams: Record<string, any> = {}): Promise<boolean> {
    return this.router.navigate([ this.SIGN_IN_URL ], { queryParams: queryParams });
  }

  navigateToSignUp(queryParams: Record<string, any> = {}): Promise<boolean> {
    return this.router.navigate([ this.SIGN_UP_URL ], { queryParams: queryParams });
  }

  navigateToPasswordReset(queryParams: Record<string, any> = {}): Promise<boolean> {
    return this.router.navigate([ this.PASSWORD_RESET_URL ], { queryParams: queryParams });
  }
}
