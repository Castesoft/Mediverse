import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { AccountService } from 'src/app/_services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const snackbarService = inject(SnackbarService);

  if (
    accountService.roles().includes('Admin') ||
    accountService.roles().includes('Moderator')
  ) {
    return true;
  } else {
    snackbarService.error('You cannot enter this area');
    return false;
  }
};
