import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

export const anonymousGuard: CanActivateFn = (route, state) => {
  const accountService: AccountService = inject(AccountService);
  const router: Router = inject(Router);

  if (!accountService.current()) {
    return true;
  } else {
    router.navigateByUrl('/cuenta').catch(console.error);
    return false;
  }
};
