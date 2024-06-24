import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { AccountService } from '../_services/accounts.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return accountService.loaded$.pipe(
    switchMap(isLoaded => {
      if (!isLoaded) {
        // Si accountLoaded$ emite false, redirigir al login
        router.navigateByUrl('/auth/login');
        return of(false);
      }
      return accountService.current$.pipe(
        take(1), // Tomar solo el primer valor emitido
        map(account => {
          if (account === null) {
            // Si currentAccount$ es null, redirigir al login
            router.navigateByUrl('/auth/login');
            return false;
          }
          if (account.roles.includes('Admin')) {
            // Si el usuario es Admin, permitir acceso
            return true;
          } else {
            // Si no es Admin, mostrar mensaje y logout
            toastr.error('Acceso restringido');
            accountService.logout();
            return false;
          }
        }),
        catchError(() => {
          // En caso de error, redirigir al login
          router.navigateByUrl('/auth/login');
          return of(false);
        })
      );
    })
  );
};
