import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {catchError} from 'rxjs';
import { BadRequest } from 'src/app/_models/types';
import { SnackbarService } from 'src/app/_services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            snackbarService.error('Solicitud incorrecta: ' + error.error);
            throw new BadRequest(error);
            break;
          case 401:
            // toastr.error('Unauthorised', error.status)
            snackbarService.error('No autorizado');
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {state: {error: error.error}};
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            snackbarService.error('Algo salió mal');
            break;
        }
      }
      throw error;
    })
  )
};
