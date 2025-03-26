import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router"; // Import Router
import { catchError, EMPTY, throwError } from "rxjs"; // Import EMPTY and throwError
import { BadRequest } from '../_models/forms/badRequest';

const FORBIDDEN_ROUTE = '/error/403';
const NOT_FOUND_ROUTE = '/error/404';

export const errorInterceptor: () => HttpInterceptorFn = () => (req, next) => {
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            const badRequestError = new BadRequest(error);
            return throwError(() => badRequestError);

          case 401:
            const unauthorizedError = new BadRequest(error);
            return throwError(() => unauthorizedError);

          case 403:
            // TODO - Uncomment this block to redirect to the FORBIDDEN_ROUTE
            // const forbiddenError = new BadRequest(error);
            // if (showSnackBars) {
            //   matSnackBar.open(`403 Prohibido: ${forbiddenError.message || 'No tiene permisos suficientes.'}`, 'Cerrar', { duration: 3000 });
            // }
            console.error('403 Forbidden - Redirecting:', error);
            router.navigate([ FORBIDDEN_ROUTE ]).catch(console.error);
            return EMPTY;

          case 404:
            console.error('404 Not Found - Redirecting:', error);
            router.navigate([ NOT_FOUND_ROUTE ]).catch(console.error);
            return EMPTY;

          case 500:
            const serverError = new BadRequest(error);
            console.error('500 Internal Server Error:', error);
            return throwError(() => serverError);

          default:
            const defaultError = new BadRequest(error);
            const status: number | string = defaultError.error?.status || error.status || 'Desconocido';
            console.error(`Unhandled HTTP Error (${status}):`, error);
            return throwError(() => defaultError);
        }
      }
      return throwError(() => error);
    })
  );
};
