import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeClinicsCatalogRouteComponent } from 'src/app/home/routes/clinics/home-clinics-catalog-route.component';
import { HomeEventsCatalogRouteComponent } from 'src/app/home/routes/events/home-events-catalog-route.component';
import { HomePatientsCatalogRouteComponent } from 'src/app/home/routes/patients/home-patients-catalog-route.component';
import { HomeProductsCatalogRouteComponent } from 'src/app/home/routes/products/home-products-catalog-route.component';
import { HomeServicesCatalogRouteComponent } from 'src/app/home/routes/services/home-services-catalog-route.component';
import { HomeComponent } from './home.component';
import { HomePatientDetailRouteComponent } from 'src/app/home/routes/patients/home-patient-detail-route.component';
import createItemResolver from 'src/app/_utils/serviceHelper/functions/createItemResolver';
import { PatientsService } from 'src/app/patients/patients.config';
import { EventsService } from 'src/app/events/events.config';
import { HomeEventDetailRouteComponent } from 'src/app/home/routes/events/home-event-detail-route.component';
import titleDetailResolver from 'src/app/_utils/serviceHelper/functions/titleDetailResolver';
import titleCatalogResolver from 'src/app/_utils/serviceHelper/functions/titleCatalogResolver';
import { HomeEventCreateRouteComponent } from 'src/app/home/routes/events/home-event-create-route.component';
import { NursesService } from 'src/app/nurses/nurses.config';
import { HomeNursesCatalogRouteComponent } from 'src/app/home/routes/nurses/home-nurses-catalog-route.component';
import { HomeNurseDetailRouteComponent } from 'src/app/home/routes/nurses/home-nurse-detail-route.component';
import { HomePatientCreateRouteComponent } from 'src/app/home/routes/patients/home-patient-create-route.component';
import { ClinicsService } from 'src/app/clinics/clinics.config';
import { ServicesService } from 'src/app/services/services.config';
import { PrescriptionsService } from 'src/app/prescriptions/prescriptions.config';
import { OrdersService } from 'src/app/orders/orders.config';
import { ProductsService } from 'src/app/products/products.config';
import { HomeEventEditRouteComponent } from 'src/app/home/routes/events/home-event-edit-route.component';
import { HomePatientEditRouteComponent } from 'src/app/home/routes/patients/home-patient-edit-route.component';
import { HomeServiceCreateRouteComponent } from 'src/app/home/routes/services/home-service-create-route.component';
import { HomeServiceDetailRouteComponent } from 'src/app/home/routes/services/home-service-detail-route.component';
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
import { HomePharmacyCatalogRouteComponent } from "./routes/pharmacy/home-pharmacy-catalog-route.component";
import { PharmaciesService } from "../pharmacies/pharmacies.config";
import { FormUse } from "src/app/_models/forms/formTypes";


@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: HomeComponent,
      children: [
        {
          path: 'search',
          loadChildren: () => import('../search/search.config').then(x => x.SearchModule)
        },
        // Pacientes
        {
          path: 'pacientes',
          component: HomePatientsCatalogRouteComponent,
          title: titleCatalogResolver(PatientsService),
          data: { breadcrumb: 'Pacientes', title: 'Pacientes' },
        },
        {
          path: 'pacientes/nuevo',
          component: HomePatientCreateRouteComponent,
          title: titleDetailResolver(PatientsService, FormUse.CREATE),
        },
        {
          path: 'pacientes/:id',
          component: HomePatientDetailRouteComponent,
          resolve: { item: createItemResolver(PatientsService), },
          title: titleDetailResolver(PatientsService, FormUse.DETAIL, 'fullName'),
          data: { breadcrumb: [ 'Pacientes', 'Ver Paciente' ], title: 'Ver Detalle de Paciente' }
        },
        {
          path: 'pacientes/:id/editar',
          component: HomePatientEditRouteComponent,
          resolve: { item: createItemResolver(PatientsService), },
          title: titleDetailResolver(PatientsService, FormUse.EDIT, 'fullName'),
          data: { breadcrumb: [ 'Pacientes', 'Editar' ], title: 'Editar Paciente', },
        },
        // Citas
        {
          data: { breadcrumb: 'Citas', title: 'Citas' },
          path: 'citas',
          component: HomeEventsCatalogRouteComponent,
          title: titleCatalogResolver(EventsService),
        },
        {
          path: 'citas/nuevo',
          component: HomeEventCreateRouteComponent,
          title: titleDetailResolver(EventsService, FormUse.CREATE),
        },
        {
          path: 'citas/:id',
          component: HomeEventDetailRouteComponent,
          resolve: { item: createItemResolver(EventsService), },
          title: titleDetailResolver(EventsService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Citas', 'Ver Cita' ], title: 'Ver Detalle de Cita' }
        },
        {
          path: 'citas/:id/editar',
          component: HomeEventEditRouteComponent,
          resolve: { item: createItemResolver(EventsService), },
          title: titleDetailResolver(EventsService, FormUse.EDIT),
        },
        // Servicios
        {
          data: { breadcrumb: 'Servicios', title: 'Servicios' },
          path: 'servicios',
          component: HomeServicesCatalogRouteComponent,
          title: titleCatalogResolver(ServicesService),
        },
        {
          path: 'servicios/nuevo',
          component: HomeServiceCreateRouteComponent,
          title: titleDetailResolver(ServicesService, FormUse.CREATE),
        },
        {
          path: 'servicios/:id',
          component: HomeServiceDetailRouteComponent,
          resolve: { item: createItemResolver(ServicesService), },
          title: titleDetailResolver(ServicesService, FormUse.DETAIL),
        },
        {
          path: 'servicios/:id/editar',
          component: HomeServiceEditRouteComponent,
          resolve: { item: createItemResolver(ServicesService), },
          title: titleDetailResolver(ServicesService, FormUse.EDIT),
        },
        // Productos
        {
          data: { breadcrumb: 'Productos', title: 'Productos' },
          path: 'productos',
          component: HomeProductsCatalogRouteComponent,
          title: titleCatalogResolver(ProductsService),
        },
        {
          path: 'productos/nuevo',
          component: HomeProductCreateRouteComponent,
          title: titleDetailResolver(ProductsService, FormUse.CREATE),
        },
        {
          path: 'productos/:id',
          component: HomeProductDetailRouteComponent,
          resolve: { item: createItemResolver(ProductsService), },
          title: titleDetailResolver(ProductsService, FormUse.DETAIL),
        },
        {
          path: 'productos/:id/editar',
          component: HomeProductEditRouteComponent,
          resolve: { item: createItemResolver(ProductsService), },
          title: titleDetailResolver(ProductsService, FormUse.EDIT),
        },
        // Pedidos
        {
          data: { breadcrumb: 'Pedidos', title: 'Pedidos' },
          path: 'pedidos',
          component: HomeOrdersCatalogRouteComponent,
          title: titleCatalogResolver(OrdersService),
        },
        {
          path: 'pedidos/nuevo',
          component: HomeOrderCreateRouteComponent,
          title: titleDetailResolver(OrdersService, FormUse.CREATE),
        },
        {
          path: 'pedidos/:id',
          component: HomeOrderDetailRouteComponent,
          resolve: { item: createItemResolver(OrdersService), },
          title: titleDetailResolver(OrdersService, FormUse.DETAIL),
        },
        {
          path: 'pedidos/:id/editar',
          component: HomeOrderEditRouteComponent,
          resolve: { item: createItemResolver(OrdersService), },
          title: titleDetailResolver(OrdersService, FormUse.EDIT),
        },
        // Recetas
        {
          data: { breadcrumb: 'Recetas', title: 'Recetas' },
          path: 'recetas',
          component: HomePrescriptionsCatalogRouteComponent,
          title: titleCatalogResolver(PrescriptionsService),
        },
        {
          path: 'recetas/nuevo',
          component: HomePrescriptionCreateRouteComponent,
          title: titleDetailResolver(PrescriptionsService, FormUse.CREATE),
        },
        {
          path: 'recetas/:id',
          component: HomePrescriptionDetailRouteComponent,
          title: titleDetailResolver(PrescriptionsService, FormUse.DETAIL),
        },
        {
          path: 'recetas/:id/editar',
          component: HomePrescriptionEditRouteComponent,
          resolve: { item: createItemResolver(PrescriptionsService), },
          title: titleDetailResolver(PrescriptionsService, FormUse.EDIT),
        },
        // Clinicas
        {
          data: { breadcrumb: 'Clinicas', title: 'Clinicas' },
          path: 'clinicas',
          component: HomeClinicsCatalogRouteComponent,
          title: titleCatalogResolver(ClinicsService),
        },
        {
          path: 'clinicas/nuevo',
          component: HomeClinicCreateRouteComponent,
          title: titleDetailResolver(ClinicsService, FormUse.CREATE),
        },
        {
          path: 'clinicas/:id',
          component: HomeClinicDetailRouteComponent,
          resolve: { item: createItemResolver(ClinicsService), },
          title: titleDetailResolver(ClinicsService, FormUse.DETAIL),
        },
        {
          path: 'clinicas/:id/editar',
          component: HomeClinicEditRouteComponent,
          resolve: { item: createItemResolver(ClinicsService), },
          title: titleDetailResolver(ClinicsService, FormUse.EDIT),
        },
        // Especialistas
        {
          data: { breadcrumb: 'Especialistas', title: 'Especialistas' },
          path: 'especialistas',
          component: HomeNursesCatalogRouteComponent,
          title: titleCatalogResolver(NursesService),
        },
        {
          path: 'especialistas/nuevo',
          component: HomeNurseCreateRouteComponent,
          title: titleDetailResolver(NursesService, FormUse.CREATE),
        },
        {
          path: 'especialistas/:id',
          component: HomeNurseDetailRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, FormUse.DETAIL),
        },
        {
          path: 'especialistas/:id/editar',
          component: HomeNurseEditRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, FormUse.EDIT),
        },
        // Farmacia
        {
          data: { breadcrumb: 'Farmacia', title: 'Farmacia' },
          path: "farmacia",
          component: HomePharmacyCatalogRouteComponent,
          title: titleCatalogResolver(PharmaciesService)
        },
      ],
    },
  ]) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
