import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationExtras, Router} from '@angular/router';
import {catchError} from 'rxjs';
import { BadRequest } from 'src/app/_models/types';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const matSnackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            matSnackBar.open('Solicitud incorrecta', 'Cerrar', {duration: 5000});
            throw new BadRequest(error);
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
