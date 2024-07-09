import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  if (accountService.current()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.current()?.token}`
      }
    })
  }

  return next(req);
};
