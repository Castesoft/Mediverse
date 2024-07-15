import localeEsMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, Component, importProvidersFrom, inject, isDevMode, OnInit } from '@angular/core';
import {provideNativeDateAdapter} from "@angular/material/core";
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import {FlatpickrModule} from "angularx-flatpickr";
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from 'src/app/_interceptors/error.interceptor';
import { jwtInterceptor } from 'src/app/_interceptors/jwt.interceptor';
import { loadingInterceptor } from 'src/app/_interceptors/loading.interceptor';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AccountService } from 'src/app/_services/account.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';

@Component({
  selector: 'app-root',
  host: { class: 'h-100' },
  template: `
    <router-outlet></router-outlet>

    <div scrolltop></div>
    <div formErrorModal></div>
    <mat-menu #appMenu="matMenu">
      <ng-template matMenuContent>
        <button mat-menu-item>Settings</button>
        <button mat-menu-item>Help</button>
      </ng-template>
    </mat-menu>
  `,
  standalone: true,
  imports: [RouterOutlet, MaterialModule],
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  private breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.setCurrentUser();
    this.breadcrumb.init();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
    console.log('user', user);

  }
}

registerLocaleData(localeEsMX, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      // {
      //   path: '',
      //   loadChildren: () => import('./home/').then(m => m.HomeModule)
      // },
      { path: 'account',
        loadChildren: () => import('./account/account.component').then(m => m.AccountModule)
       },
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.config').then(m => m.AuthModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.config').then(x => x.HomeModule),
      }
    ]),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
    provideAnimations(),
    provideAnimationsAsync(),
    // localeEsMX,
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
    provideNativeDateAdapter(),
    importProvidersFrom(
      MaterialModule,
      BootstrapModule,
      FlatpickrModule.forRoot(),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      BrowserAnimationsModule,
    ),
  ],
};

