import { ScrolltopComponent } from "./_shared/template/components/scrolltop.component";
import localeEsMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, Component, importProvidersFrom, inject, isDevMode, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router, RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlatpickrModule } from "angularx-flatpickr";
import { provideToastr, ToastContainerDirective } from 'ngx-toastr';
import { errorInterceptor } from 'src/app/_interceptors/error.interceptor';
import { jwtInterceptor } from 'src/app/_interceptors/jwt.interceptor';
import { loadingInterceptor } from 'src/app/_interceptors/loading.interceptor';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AccountService } from 'src/app/_services/account.service';
import { GoogleLoginProvider, SocialLoginModule } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { anonymousGuard } from 'src/app/_guards/anonymous.guard';
import { authGuard } from 'src/app/_guards/auth.guard';
import {
  UseOfCookiesModalComponent
} from 'src/app/auth/components/use-of-cookies-modal/use-of-cookies-modal.component';
import { providePrimeNG } from "primeng/config";
import { ShortcutsService } from 'src/app/_services/shortcuts.service';

declare var google: any;

@Component({
  selector: 'app-root',
  host: { class: 'h-100' },
  template: `
    <router-outlet></router-outlet>
    <div scrolltop></div>
    <div toastContainer></div>

    @if (cookiesAccepted === 'false') {
      <div class="fixed-bottom bg-dark text-white text-center p-8 shadow-lg"
           style="z-index: 100; width: 30%; bottom: 30px; left: 30px; border-radius: 10px;">
        <p class="fs-6 m-0">
          Este sitio web utiliza cookies para mejorar la experiencia de usuario. Al continuar utilizando esta página
          estás aceptando nuestras políticas de
          <a
            (click)="openUseOfCookiesModal()"
            class="text-muted text-hover-primary"
            style="cursor: pointer"
          >
            Uso de cookies
          </a>
        </p>
        <button class="btn btn-small btn-primary mt-2" (click)="accept()">Aceptar</button>
      </div>
    }
  `,
  standalone: true,
  imports: [ RouterOutlet, MaterialModule, ScrolltopComponent, ToastContainerDirective ],
})
export class AppComponent implements OnInit {
  private readonly bsModalService = inject(BsModalService);
  private readonly accountService = inject(AccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shortcuts = inject(ShortcutsService);

  cookiesAccepted = 'true';

  ngOnInit(): void {
    this.cookiesAccepted = localStorage.getItem('cookiesAccepted') || '';
    if (!this.cookiesAccepted) {
      localStorage.setItem('cookiesAccepted', 'false');
      this.cookiesAccepted = 'false';
    }

    this.setCurrentUser();

    google.accounts?.id.initialize({
      client_id: environment.google_client_id,
      use_fedcm_for_prompt: true,
      callback: (resp: any) => {
        if (this.accountService.current() === null) {
          this.accountService.loginWithSocialAuth('GOOGLE', resp.credential).subscribe({
            next: () => {
              if (this.route.snapshot.queryParams['noredirect']) return;
              this.router.navigate([ '/cuenta' ]);
            }
          });
        } else {
          this.accountService.linkSocialAccount('GOOGLE', resp.credential).subscribe();
        }
      }
    });

  }

  accept() {
    localStorage.setItem('cookiesAccepted', 'true');
    this.cookiesAccepted = 'true';
  }

  openUseOfCookiesModal() {
    this.bsModalService.show(UseOfCookiesModalComponent);
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    console.log('Setting current user', user);
    this.accountService.setCurrentUser(user);
    this.accountService.getCurrent().subscribe();
  }
}

registerLocaleData(localeEsMX, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-MX" },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: "dd/MM/YYYY"
        },
        display: {
          dateInput: "dd/MM/YYYY",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "LL",
          monthYearA11yLabel: "MMMM YYYY"
        }
      }
    },
    provideRouter([
      {
        path: '',
        loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
      },
      {
        path: 'auth',
        canActivate: [ anonymousGuard ],
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [ authGuard ],
        children: [
          {
            path: 'admin',
            loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
          },
          {
            path: 'cuenta',
            loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
          },
          {
            path: 'inicio',
            loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
          },
          {
            path: 'pagos',
            loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule)
          },
          {
            path: 'onboarding',
            loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule)
          }
        ]
      },
    ]),
    provideHttpClient(withInterceptors([ errorInterceptor(false), jwtInterceptor, loadingInterceptor ])),
    provideAnimations(),
    providePrimeNG(),
    provideAnimationsAsync(),
    // localeEsMX,
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
    provideNativeDateAdapter(),
    importProvidersFrom(
      MaterialModule,
      BootstrapModule,
      QuillModule.forRoot(),
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

