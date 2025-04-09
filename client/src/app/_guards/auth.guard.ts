import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authNavigationService: AuthNavigationService = inject(AuthNavigationService);
  const accountService: AccountService = inject(AccountService);

  if (accountService.current()) {
    return true;
  } else {
    authNavigationService.navigateToSignIn({ returnUrl: state.url }).catch(console.error);
    return false;
  }
};
