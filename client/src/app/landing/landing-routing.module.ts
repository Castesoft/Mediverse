import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LandingComponent } from "src/app/landing/components/landing.component";
import { SearchResultsComponent } from "src/app/landing/components/search-results/search-results.component";
import { LandingServicesRouteComponent } from "src/app/landing/routes/services/landing-services-route.component";
import { PricingComponent } from "src/app/landing/components/pricing/pricing.component";
import { DoctorProfileComponent } from "src/app/landing/components/doctor-profile/doctor-profile.component";
import { LandingRouterComponent } from "src/app/landing/landing.config";
import { ContactComponent } from "src/app/landing/routes/contact/contact.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LandingRouterComponent,
        children: [
          {
            path: '',
            component: LandingComponent,
            title: 'DocHub'
          },
          {
            path: 'search',
            component: SearchResultsComponent,
            title: 'DocHub | Especialistas',
          },
          {
            path: 'contact',
            component: ContactComponent,
            title: 'DocHub | Contacto',
          },
          {
            path: 'services',
            component: LandingServicesRouteComponent,
            title: 'DocHub | Servicios',
          },
          {
            path: 'pricing',
            component: PricingComponent,
            title: 'DocHub | Precios'
          },
          {
            path: 'doctor/:id',
            component: DoctorProfileComponent,
            title: 'DocHub | Perfil del Doctor',
          },
        ],
      },
    ]),
  ],
  exports: [ RouterModule ],
})
export class LandingRoutingModule {}
