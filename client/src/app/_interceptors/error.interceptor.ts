import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, throwError } from 'rxjs';
import { ok } from 'assert';
import { AccountService } from '../_services/accounts.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const accountService = inject(AccountService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        if (error.status === 400) {
          if (error.error.errors) {
            throw error.error;
          } else {
            toastr.error(error.error.message, "Mala petición");
            throw error.error;
          }
        }
        if (error.status === 401) {

          toastr.error("No autorizado");
        }
        if (error.status === 403) {
          console.log("403 error", error);
          toastr.error("Acceso restringido");
        }
        if (error.status === 404) {
          toastr.error(error.error.message, "No encontrado");
          router.navigate(['/not-found']);
        };
        if (error.status === 500) {
          const navigationExtras: NavigationExtras = { state: { error: error.error } };
          router.navigate(['/server-error'], navigationExtras);
        }
      }
      return throwError(() => new Error(error.message));
    })
  );
};
