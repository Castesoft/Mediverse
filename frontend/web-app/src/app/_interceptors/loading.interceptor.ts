import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize, identity } from 'rxjs';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { environment } from '../../environments/environment';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if (req.url.includes('emailExists')) {
    return next(req);
  }

  busyService.busy();

  return next(req).pipe(
    (environment.production ? identity : delay(10)),
    finalize(() => busyService.idle())
  );
};
