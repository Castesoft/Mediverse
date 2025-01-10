import { Component, NgModule } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { DoctorProfileComponent } from 'src/app/landing/components/doctor-profile/doctor-profile.component';
import { LandingNavbarComponent } from 'src/app/landing/components/landing-navbar/landing-navbar.component';
import { LandingComponent } from 'src/app/landing/components/landing.component';
import { PricingComponent } from 'src/app/landing/components/pricing/pricing.component';
import { SearchResultsComponent } from 'src/app/landing/components/search-results/search-results.component';
import { LandingServicesRouteComponent } from 'src/app/landing/routes/services/landing-services-route.component';

@Component({
  selector: 'landing-route',
  template: `
    <app-landing-navbar
      *ngIf="showNavbar"
      [isLightBackground]="isLightBackground"
    ></app-landing-navbar>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, LandingNavbarComponent],
})
export class LandingRouterComponent {
  showNavbar = true;
  isLightBackground = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !event.url.includes('/search');
        this.isLightBackground =
          event.url.includes('/services') ||
          event.url.includes('/pricing') ||
          event.url.includes('/doctor');
      }
    });
  }
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LandingRouterComponent,
        children: [
          { path: '', component: LandingComponent, title: 'DocHub' },
          {
            path: 'search',
            component: SearchResultsComponent,
            title: 'Especialistas',
          },
          {
            path: 'services',
            component: LandingServicesRouteComponent,
            title: 'Servicios',
          },
          { path: 'pricing', component: PricingComponent, title: 'Precios' },
          {
            path: 'doctor/:id',
            component: DoctorProfileComponent,
            title: 'Perfil del Doctor',
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class LandingRoutingModule {}

@NgModule({
  declarations: [
    LandingServicesRouteComponent,
  ],
  imports: [CommonModule, LandingRoutingModule, LayoutModule],
})
export class LandingModule {}
