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
import { HomeClinicsCatalogRouteComponent } from 'src/app/home/routes/clinics/home-clinics-catalog-route.component';
import { HomeEventsCatalogRouteComponent } from 'src/app/home/routes/events/home-events-catalog-route.component';
import { HomePatientsCatalogRouteComponent } from 'src/app/home/routes/patients/home-patients-catalog-route.component';
import { HomeProductsCatalogRouteComponent } from 'src/app/home/routes/products/home-products-catalog-route.component';
import { HomeServicesCatalogRouteComponent } from 'src/app/home/routes/services/home-services-catalog-route.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ProductsCatalogComponent } from 'src/app/products/components/products-catalog.component';
import { ServicesCatalogComponent } from 'src/app/services/components/services-catalog.component';
import { UsersCatalogComponent } from 'src/app/users/components/users-catalog.component';
import { ClinicsCatalogComponent } from 'src/app/clinics/components/clinics-catalog.component';
import { PatientsCatalogComponent } from 'src/app/patients/components/patients-catalog.component';
import { HomePatientDetailRouteComponent } from 'src/app/home/routes/patients/home-patient-detail-route.component';
import { PatientDetailComponent } from "../patients/components/patient-detail.component";
import { EventDetailComponent } from 'src/app/events/events.config';
import { HomeEventDetailRouteComponent } from 'src/app/home/routes/events/home-event-detail-route.component';
import { HomeEventCreateRouteComponent } from 'src/app/home/routes/events/home-event-create-route.component';
import { HomeNursesCatalogRouteComponent } from 'src/app/home/routes/nurses/home-nurses-catalog-route.component';
import { HomeNurseDetailRouteComponent } from 'src/app/home/routes/nurses/home-nurse-detail-route.component';
import { NursesCatalogComponent } from 'src/app/nurses/components/nurses-catalog.component';
import { NurseDetailComponent } from 'src/app/nurses/nurses.config';
import { NurseFormComponent } from '../nurses/nurse-form.component';
import { HomePatientCreateRouteComponent } from 'src/app/home/routes/patients/home-patient-create-route.component';
import { HomeEventEditRouteComponent } from 'src/app/home/routes/events/home-event-edit-route.component';
import { HomePatientEditRouteComponent } from 'src/app/home/routes/patients/home-patient-edit-route.component';
import { HomeServiceDetailRouteComponent } from 'src/app/home/routes/services/home-service-detail-route.component';
import { ServiceDetailComponent } from 'src/app/services/services.config';
import { HomeServiceCreateRouteComponent } from 'src/app/home/routes/services/home-service-create-route.component';
import { HomeServiceEditRouteComponent } from 'src/app/home/routes/services/home-service-edit-route.component';
import { HomeProductCreateRouteComponent } from 'src/app/home/routes/products/home-product-create-route.component';
import { HomeProductDetailRouteComponent } from 'src/app/home/routes/products/home-product-detail-route.component';
import { HomeProductEditRouteComponent } from 'src/app/home/routes/products/home-product-edit-route.component';
import { HomeOrdersCatalogRouteComponent } from 'src/app/home/routes/orders/home-orders-catalog-route.component';
import { HomeOrderCreateRouteComponent } from 'src/app/home/routes/orders/home-order-create-route.component';
import { HomeOrderDetailRouteComponent } from 'src/app/home/routes/orders/home-order-detail-route.component';
import { HomeOrderEditRouteComponent } from 'src/app/home/routes/orders/home-order-edit-route.component';
import {
  HomePrescriptionsCatalogRouteComponent
} from 'src/app/home/routes/prescriptions/home-prescriptions-catalog-route.component';
import {
  HomePrescriptionCreateRouteComponent
} from 'src/app/home/routes/prescriptions/home-prescription-create-route.component';
import {
  HomePrescriptionDetailRouteComponent
} from 'src/app/home/routes/prescriptions/home-prescription-detail-route.component';
import {
  HomePrescriptionEditRouteComponent
} from 'src/app/home/routes/prescriptions/home-prescription-edit-route.component';
import { HomeClinicCreateRouteComponent } from 'src/app/home/routes/clinics/home-clinic-create-route.component';
import { HomeClinicDetailRouteComponent } from 'src/app/home/routes/clinics/home-clinic-detail-route.component';
import { HomeClinicEditRouteComponent } from 'src/app/home/routes/clinics/home-clinic-edit-route.component';
import { HomeNurseCreateRouteComponent } from 'src/app/home/routes/nurses/home-nurse-create-route.component';
import { HomeNurseEditRouteComponent } from 'src/app/home/routes/nurses/home-nurse-edit-route.component';
import { OrdersCatalogComponent } from 'src/app/orders/orders-catalog.component';
import { PrescriptionDetailComponent } from 'src/app/prescriptions/prescriptions.config';
import {
  PrescriptionsCatalogComponent
} from 'src/app/prescriptions/components/prescriptions-catalog/prescriptions-catalog.component';
import { ClinicDetailComponent } from 'src/app/clinics/clinics.config';
import { MaterialModule } from 'src/app/_shared/material.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { HomePharmacyCatalogRouteComponent } from "./routes/pharmacy/home-pharmacy-catalog-route.component";
import { BreadcrumbsComponent } from "src/app/_shared/components/breadcrumbs.component";
import { OrderFormComponent } from "src/app/orders/order-form.component";
import { ProductFormComponent } from "src/app/products/product-form.component";
import { PatientFormComponent } from "src/app/patients/patients.config";
import { ClinicFormComponent } from 'src/app/clinics/clinic-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeEventsCatalogRouteComponent,
    HomePatientsCatalogRouteComponent,
    HomeServicesCatalogRouteComponent,
    HomeProductsCatalogRouteComponent,
    HomeClinicsCatalogRouteComponent,
    HomePatientDetailRouteComponent,
    HomePharmacyCatalogRouteComponent,
    HomeEventDetailRouteComponent,
    HomeEventCreateRouteComponent,
    HomeNursesCatalogRouteComponent,
    HomeNurseDetailRouteComponent,
    HomePatientCreateRouteComponent,
    HomeEventEditRouteComponent,
    HomePatientEditRouteComponent,
    HomeServiceCreateRouteComponent,
    HomeServiceDetailRouteComponent,
    HomeServiceEditRouteComponent,
    HomeProductCreateRouteComponent,
    HomeProductDetailRouteComponent,
    HomeProductEditRouteComponent,
    HomeOrdersCatalogRouteComponent,
    HomeOrderCreateRouteComponent,
    HomeOrderDetailRouteComponent,
    HomeOrderEditRouteComponent,
    HomePrescriptionsCatalogRouteComponent,
    HomePrescriptionCreateRouteComponent,
    HomePrescriptionDetailRouteComponent,
    HomePrescriptionEditRouteComponent,
    HomeClinicCreateRouteComponent,
    HomeClinicDetailRouteComponent,
    HomeClinicEditRouteComponent,
    HomeNurseCreateRouteComponent,
    HomeNurseEditRouteComponent,
  ],
  imports: [
    HomeRoutingModule,
    BootstrapModule,
    CdkModule,
    Forms2Module,
    MaterialModule,
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
    NursesCatalogComponent,
    NurseDetailComponent,
    ServiceDetailComponent,
    OrdersCatalogComponent,
    PrescriptionDetailComponent,
    PrescriptionsCatalogComponent,
    ClinicDetailComponent,
    BreadcrumbsComponent,
    OrderFormComponent,
    ProductFormComponent,
    PatientFormComponent,
    ClinicFormComponent,
    NurseFormComponent,
  ],
  exports: [ HomeComponent ],
})
export class HomeModule {}
