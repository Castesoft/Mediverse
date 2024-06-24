import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

export const devGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return new Promise<boolean>((resolve) => {
    if (environment.production) {
      toastr.error('This route is only accessible in development environment');
      router.navigate(['/']);
      resolve(false);
    } else {
      resolve(true);
    }
  });
};
