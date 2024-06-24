import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { AccountService } from '../_services/accounts.service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return accountService.loaded$.pipe(
    switchMap(isLoaded => {
      if (!isLoaded) {
        router.navigateByUrl('/auth/login');
        return of(false);
      }
      return accountService.current$.pipe(
        take(1),
        map(account => {
          if (account === null) {
            router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
            toastr.error('Debes iniciar sesión');
            accountService.logout();
            return false;
          }
          else {
            return true;
          }
        }),
        catchError(() => {
          router.navigateByUrl('/auth/login');
          return of(false);
        })
      );
    })
  );
};
