import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationExtras, Router} from '@angular/router';
import {catchError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const matSnackBar = inject(MatSnackBar);


  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key])
                }
              }
              throw modalStateErrors.flat();
            } else {
              // matSnackBar.open(error.error, 'Cerrar', {duration: 5000});
            }
            break;
          case 401:
            // toastr.error('Unauthorised', error.status)
            matSnackBar.open('No autorizado', 'Cerrar', {duration: 5000});
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {state: {error: error.error}};
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            matSnackBar.open('Algo salió mal', 'Cerrar', {duration: 5000});
            break;
        }
      }
      throw error;
    })
  )
};
