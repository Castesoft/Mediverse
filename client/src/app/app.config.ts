declare var google: any;
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
import { authGuard } from './_guards/auth.guard';
import { anonymousGuard } from './_guards/anonymous.guard';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  host: { class: 'h-100' },
  template: `
    <router-outlet></router-outlet>
    <div scrolltop></div>
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

    google.accounts.id.initialize({
      client_id: environment.google_client_id,
      use_fedcm_for_prompt: true,
      callback: (resp: any) => {
        if (this.accountService.current() === null) {
          this.accountService.loginWithSocialAuth('GOOGLE', resp.credential).subscribe();
        } else {
          this.accountService.linkSocialAccount('GOOGLE', resp.credential).subscribe();
        }
      }
    });

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
      {
        path: '',
        canActivate: [anonymousGuard],
        loadChildren: () => import('./landing/landing.config').then(m => m.LadingModule),
      },
      {
        path: 'auth',
        canActivate: [anonymousGuard],
        loadChildren: () => import('./auth/auth.config').then(m => m.AuthModule)
      },
      {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
          { path: 'account',
            loadChildren: () => import('./account/account.component').then(m => m.AccountModule)
           },
          {
            path: 'home',
            loadChildren: () => import('./home/home.config').then(x => x.HomeModule),
          }
        ]
      },
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
      SocialLoginModule.initialize({
        autoLogin: false,
        lang: 'es',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.google_client_id),
          },
        ],
      })
    )
  ],
};

