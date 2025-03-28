import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from "ngx-toastr";

export const nonDoctorGuard: CanActivateFn = (route, state) => {
  const accountService: AccountService = inject(AccountService);
  const router: Router = inject(Router);

  if (!accountService.roles().includes('Doctor')) {
    return true;
  } else {
    router.navigate([ '/error/404' ]).catch(console.error);
    return false;
  }
};
