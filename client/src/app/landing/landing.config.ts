import { Component, NgModule } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../_shared/layout.module';
import { LandingComponent } from './components/landing.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ServicesComponent } from './components/services/services.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { LandingNavbarComponent } from './components/landing-navbar/landing-navbar.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';

@Component({
    selector: 'landing-route',
    template: `
        <app-landing-navbar *ngIf="showNavbar" [isLightBackground]="isLightBackground"></app-landing-navbar>
        <router-outlet></router-outlet>
    `,
    standalone: true,
    imports: [CommonModule, RouterModule, LandingNavbarComponent]
})
export class LandingRouterComponent {
    showNavbar = true;
    isLightBackground = false;

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.showNavbar = !event.url.includes('/search');
                this.isLightBackground = event.url.includes('/services') || event.url.includes('/pricing') || event.url.includes('/doctor');
            }
        });
    }
}

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', 
            component: LandingRouterComponent,
            children: [
                { path: '', component: LandingComponent, title: 'Mediverse', data: { breadcrumb: 'Landing' } },
                { path: 'search', component: SearchResultsComponent, title: 'Especialistas', data: { breadcrumb: 'Landing' } },
                { path: 'services', component: ServicesComponent, title: 'Servicios', data: { breadcrumb: 'Servicios' } },
                { path: 'pricing', component: PricingComponent, title: 'Precios', data: { breadcrumb: 'Precios' } },
                { path: 'doctor/:id', component: DoctorProfileComponent, title: 'Perfil del Doctor', data: { breadcrumb: 'Perfil del Doctor' } },
            ],
        },
    ])],
    exports: [RouterModule]
})
export class LandingRoutingModule {}

@NgModule({
    imports: [CommonModule, LandingRoutingModule, LayoutModule]
})
export class LandingModule {}
