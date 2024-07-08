import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from '../_services/accounts.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  let token: string | undefined;

  accountService.current$.pipe(take(1)).subscribe({
    next: account => {
      token = account?.token;

      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
  });

  return next(req);
};
