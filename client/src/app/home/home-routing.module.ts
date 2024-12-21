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
import { HomePrescriptionsCatalogRouteComponent } from 'src/app/home/routes/prescriptions/home-prescriptions-catalog-route.component';
import { HomePrescriptionCreateRouteComponent } from 'src/app/home/routes/prescriptions/home-prescription-create-route.component';
import { HomePrescriptionDetailRouteComponent } from 'src/app/home/routes/prescriptions/home-prescription-detail-route.component';
import { HomePrescriptionEditRouteComponent } from 'src/app/home/routes/prescriptions/home-prescription-edit-route.component';
import { HomeClinicCreateRouteComponent } from 'src/app/home/routes/clinics/home-clinic-create-route.component';
import { HomeClinicDetailRouteComponent } from 'src/app/home/routes/clinics/home-clinic-detail-route.component';
import { HomeClinicEditRouteComponent } from 'src/app/home/routes/clinics/home-clinic-edit-route.component';
import { HomeNurseCreateRouteComponent } from 'src/app/home/routes/nurses/home-nurse-create-route.component';
import { HomeNurseEditRouteComponent } from 'src/app/home/routes/nurses/home-nurse-edit-route.component';


@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: HomeComponent,
      children: [
        {
          path: 'search',
          loadChildren: () => import('../search/search.config').then(x => x.SearchModule)
        },
        // pacientes
        {
          path: 'pacientes',
          component: HomePatientsCatalogRouteComponent,
        },
        {
          path: 'pacientes/nuevo',
          component: HomePatientCreateRouteComponent,
          title: titleDetailResolver(PatientsService, 'create'),
        },
        {
          path: 'pacientes/:id',
          component: HomePatientDetailRouteComponent,
          resolve: { item: createItemResolver(PatientsService), },
          title: titleDetailResolver(PatientsService, 'detail'),
        },
        {
          path: 'pacientes/:id/editar',
          component: HomePatientEditRouteComponent,
          resolve: { item: createItemResolver(PatientsService), },
          title: titleDetailResolver(PatientsService, 'edit'),
        },
        // citas
        {
          path: 'citas',
          component: HomeEventsCatalogRouteComponent,
          title: titleCatalogResolver(EventsService),
        },
        {
          path: 'citas/nuevo',
          component: HomeEventCreateRouteComponent,
          title: titleDetailResolver(EventsService, 'create'),
        },
        {
          path: 'citas/:id',
          component: HomeEventDetailRouteComponent,
          resolve: { item: createItemResolver(EventsService), },
          title: titleDetailResolver(EventsService, 'detail'),
        },
        {
          path: 'citas/:id/editar',
          component: HomeEventEditRouteComponent,
          resolve: { item: createItemResolver(EventsService), },
          title: titleDetailResolver(EventsService, 'edit'),
        },
        // servicios
        {
          path: 'servicios',
          component: HomeServicesCatalogRouteComponent,
          title: titleCatalogResolver(ServicesService),
        },
        {
          path: 'servicios/nuevo',
          component: HomeServiceCreateRouteComponent,
          title: titleDetailResolver(ServicesService, 'create'),
        },
        {
          path: 'servicios/:id',
          component: HomeServiceDetailRouteComponent,
          resolve: { item: createItemResolver(ServicesService), },
          title: titleDetailResolver(ServicesService, 'detail'),
        },
        {
          path: 'servicios/:id/editar',
          component: HomeServiceEditRouteComponent,
          resolve: { item: createItemResolver(ServicesService), },
          title: titleDetailResolver(ServicesService, 'edit'),
        },
        // productos
        {
          path: 'productos',
          component: HomeProductsCatalogRouteComponent,
          title: titleCatalogResolver(ProductsService),
        },
        {
          path: 'productos/nuevo',
          component: HomeProductCreateRouteComponent,
          title: titleDetailResolver(ProductsService, 'create'),
        },
        {
          path: 'productos/:id',
          component: HomeProductDetailRouteComponent,
          resolve: { item: createItemResolver(ProductsService), },
          title: titleDetailResolver(ProductsService, 'detail'),
        },
        {
          path: 'productos/:id/editar',
          component: HomeProductEditRouteComponent,
          resolve: { item: createItemResolver(ProductsService), },
          title: titleDetailResolver(ProductsService, 'edit'),
        },
        // pedidos
        {
          path: 'pedidos',
          component: HomeOrdersCatalogRouteComponent,
          title: titleCatalogResolver(OrdersService),
        },
        {
          path: 'pedidos/nuevo',
          component: HomeOrderCreateRouteComponent,
          title: titleDetailResolver(OrdersService, 'create'),
        },
        {
          path: 'pedidos/:id',
          component: HomeOrderDetailRouteComponent,
          resolve: { item: createItemResolver(OrdersService), },
          title: titleDetailResolver(OrdersService, 'detail'),
        },
        {
          path: 'pedidos/:id/editar',
          component: HomeOrderEditRouteComponent,
          resolve: { item: createItemResolver(OrdersService), },
          title: titleDetailResolver(OrdersService, 'edit'),
        },
        // recetas
        {
          path: 'recetas',
          component: HomePrescriptionsCatalogRouteComponent,
          title: titleCatalogResolver(PrescriptionsService),
        },
        {
          path: 'recetas/nuevo',
          component: HomePrescriptionCreateRouteComponent,
          title: titleDetailResolver(PrescriptionsService, 'create'),
        },
        {
          path: 'recetas/:id',
          component: HomePrescriptionDetailRouteComponent,
          title: titleDetailResolver(PrescriptionsService, 'detail'),
        },
        {
          path: 'recetas/:id/editar',
          component: HomePrescriptionEditRouteComponent,
          resolve: { item: createItemResolver(PrescriptionsService), },
          title: titleDetailResolver(PrescriptionsService, 'edit'),
        },
        // clinicas
        {
          path: 'clinicas',
          component: HomeClinicsCatalogRouteComponent,
          title: titleCatalogResolver(ClinicsService),
        },
        {
          path: 'clinicas/nuevo',
          component: HomeClinicCreateRouteComponent,
          title: titleDetailResolver(ClinicsService, 'create'),
        },
        {
          path: 'clinicas/:id',
          component: HomeClinicDetailRouteComponent,
          resolve: { item: createItemResolver(ClinicsService), },
          title: titleDetailResolver(ClinicsService, 'detail'),
        },
        {
          path: 'clinicas/:id/editar',
          component: HomeClinicEditRouteComponent,
          resolve: { item: createItemResolver(ClinicsService), },
          title: titleDetailResolver(ClinicsService, 'edit'),
        },
        // especialistas
        {
          path: 'especialistas',
          component: HomeNursesCatalogRouteComponent,
          title: titleCatalogResolver(NursesService),
        },
        {
          path: 'especialistas/nuevo',
          component: HomeNurseCreateRouteComponent,
          title: titleDetailResolver(NursesService, 'create'),
        },
        {
          path: 'espacialistas/:id',
          component: HomeNurseDetailRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, 'detail'),
        },
        {
          path: 'espacialistas/:id/editar',
          component: HomeNurseEditRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, 'edit'),
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
