import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { AccountService } from '../_services/accounts.service';
import { EnvService } from '../_services/env.service';

export const userGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const devService = inject(EnvService);
  const router = inject(Router);

  return devService.mode$.pipe(
    switchMap(devMode => {
      if (devMode) {
        return of(true);
      }
      return accountService.loaded$.pipe(
        switchMap(isLoaded => {
          if (!isLoaded) {
            router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return of(false);
          }
          return accountService.current$.pipe(
            take(1),
            map(account => {
              if (account === null) {
                router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
                return false;
              }
              if (account.roles.includes('User')) {
                return true;
              } else {
                toastr.error('Acceso restringido');
                accountService.logout();
                return false;
              }
            }),
            catchError(() => {
              router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
              return of(false);
            })
          );
        })
      );
    })
  );
};
