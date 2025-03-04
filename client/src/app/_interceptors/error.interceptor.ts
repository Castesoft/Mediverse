import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError } from "rxjs";
import { BadRequest } from '../_models/forms/badRequest';

export const errorInterceptor: (showSnackBars: boolean) => HttpInterceptorFn = (showSnackBars) => (req, next) => {
  const matSnackBar: MatSnackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            const item = new BadRequest(error);
            if (showSnackBars) {
              item.message && matSnackBar.open(item.message, 'Cerrar', { duration: 5000 });
              if (item.validationErrors && item.validationErrors.length > 0) {
                matSnackBar.open(`${item.validationErrors.length} errores de validación.`, 'Cerrar', { duration: 5000 });
              }
            }
            throw item;
          case 401:
            const unauthorizedError = new BadRequest(error);
            if (showSnackBars) {
              matSnackBar.open(`401 No autorizado: ${unauthorizedError.message}`, 'Cerrar', { duration: 5000 });
            }
            throw unauthorizedError;
          case 404:
            const notFoundError = new BadRequest(error);
            if (showSnackBars) {
              matSnackBar.open(`404 No encontrado: ${notFoundError.message}`, 'Cerrar', { duration: 5000 });
            }
            throw notFoundError;
          case 500:
            if (showSnackBars) {
              matSnackBar.open('500 Error interno del servidor.', 'Cerrar', { duration: 5000 });
            }
            const serverError = new BadRequest(error);
            throw serverError;
          default:
            const defaultError = new BadRequest(error);
            if (showSnackBars) {
              matSnackBar.open(`${defaultError.error.status}: Error desconocido.`, 'Cerrar', { duration: 5000 });
            }
            throw defaultError;
        }
      }
      throw error;
    })
  );
};
