import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from "ngx-toastr";

export const doctorGuard: CanActivateFn = (route, state) => {
  const accountService: AccountService = inject(AccountService);
  const toastr: ToastrService = inject(ToastrService);

  if (accountService.roles().includes('Doctor')) {
    return true;
  } else {
    toastr.error('No puedes acceder a esta área');
    return false;
  }
};
