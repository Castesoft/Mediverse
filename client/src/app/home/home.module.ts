import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { BreadcrumbLinkComponent } from 'src/app/_shared/template/components/breadcrumbs/breadcrumb-link.component';
import { MainAsideComponent } from 'src/app/_shared/template/components/main-aside.component';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { AddressesCatalogComponent } from 'src/app/addresses/components/addresses-catalog.component';
import { EventsCatalogComponent } from 'src/app/events/components/events-catalog.component';
import { HomeClinicsCatalogRouteComponent } from 'src/app/home/components/home-clinics-catalog-route.component';
import { HomeEventsCatalogRouteComponent } from 'src/app/home/components/home-events-catalog-route.component';
import { HomePatientsCatalogRouteComponent } from 'src/app/home/components/home-patients-catalog-route.component';
import { HomeProductsCatalogRouteComponent } from 'src/app/home/components/home-products-catalog-route.component';
import { HomeServicesCatalogRouteComponent } from 'src/app/home/components/home-services-catalog-route.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ProductsCatalogComponent } from 'src/app/products/components/products-catalog.component';
import { ServicesCatalogComponent } from 'src/app/services/components/services-catalog.component';
import { UsersCatalogComponent } from 'src/app/users/components/users-catalog.component';
import { ClinicsCatalogComponent } from 'src/app/clinics/components/clinics-catalog.component';
import { PatientsCatalogComponent } from 'src/app/patients/components/patients-catalog.component';
import { HomePatientDetailRouteComponent } from 'src/app/home/components/home-patient-detail-route.component';
import { PatientDetailComponent } from "../patients/components/patient-detail.component";
import { EventDetailComponent } from 'src/app/events/events.config';
import { HomeEventDetailRouteComponent } from 'src/app/home/components/home-event-detail-route.component';
import { HomeEventCreateRouteComponent } from 'src/app/home/components/home-event-create-route.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeEventsCatalogRouteComponent,
    HomePatientsCatalogRouteComponent,
    HomeServicesCatalogRouteComponent,
    HomeProductsCatalogRouteComponent,
    HomeClinicsCatalogRouteComponent,
    HomePatientDetailRouteComponent,
    HomeEventDetailRouteComponent,
    HomeEventCreateRouteComponent,
  ],
  imports: [
    HomeRoutingModule,
    BootstrapModule,
    CdkModule,
    RouterModule,
    CommonModule,
    TemplateModule,
    BreadcrumbLinkComponent,
    EventsCatalogComponent,
    MainAsideComponent,
    UsersCatalogComponent,
    ServicesCatalogComponent,
    ProductsCatalogComponent,
    AddressesCatalogComponent,
    ClinicsCatalogComponent,
    PatientsCatalogComponent,
    PatientDetailComponent,
    EventDetailComponent,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
