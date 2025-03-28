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
import { doctorGuard } from "src/app/_guards/doctor.guard";
import { EventsService } from "src/app/events/events.service";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.service";


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
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'pacientes/nuevo',
          component: HomePatientCreateRouteComponent,
          title: titleDetailResolver(PatientsService, FormUse.CREATE),
          data: { breadcrumb: [ 'Pacientes', 'Nuevo Paciente' ], title: 'Nuevo Paciente' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'pacientes/:id',
          component: HomePatientDetailRouteComponent,
          resolve: { item: createItemResolver(PatientsService), },
          title: titleDetailResolver(PatientsService, FormUse.DETAIL, 'fullName'),
          data: { breadcrumb: [ 'Pacientes', 'Ver Paciente' ], title: 'Ver Detalle de Paciente' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'pacientes/:id/editar',
          component: HomePatientEditRouteComponent,
          resolve: { item: createItemResolver(PatientsService), },
          title: titleDetailResolver(PatientsService, FormUse.EDIT, 'fullName'),
          data: { breadcrumb: [ 'Pacientes', 'Editar' ], title: 'Editar Paciente', },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Citas
        {
          path: 'citas',
          component: HomeEventsCatalogRouteComponent,
          title: titleCatalogResolver(EventsService),
          data: { breadcrumb: 'Citas', title: 'Citas' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'citas/nuevo',
          component: HomeEventCreateRouteComponent,
          title: titleDetailResolver(EventsService, FormUse.CREATE),
          data: { breadcrumb: [ 'Citas', 'Nueva Cita' ], title: 'Nueva Cita' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'citas/:id',
          component: HomeEventDetailRouteComponent,
          resolve: { item: createItemResolver(EventsService), },
          title: titleDetailResolver(EventsService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Citas', 'Ver Cita' ], title: 'Ver Detalle de Cita' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'citas/:id/editar',
          component: HomeEventEditRouteComponent,
          resolve: { item: createItemResolver(EventsService), },
          title: titleDetailResolver(EventsService, FormUse.EDIT),
          data: { breadcrumb: [ 'Citas', 'Editar' ], title: 'Editar Cita' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Servicios
        {
          path: 'servicios',
          component: HomeServicesCatalogRouteComponent,
          title: titleCatalogResolver(ServicesService),
          data: { breadcrumb: 'Servicios', title: 'Servicios' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'servicios/nuevo',
          component: HomeServiceCreateRouteComponent,
          title: titleDetailResolver(ServicesService, FormUse.CREATE),
          data: { breadcrumb: [ 'Servicios', 'Nuevo Servicio' ], title: 'Nuevo Servicio' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'servicios/:id',
          component: HomeServiceDetailRouteComponent,
          resolve: { item: createItemResolver(ServicesService), },
          title: titleDetailResolver(ServicesService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Servicios', 'Ver Servicio' ], title: 'Ver Detalle de Servicio' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'servicios/:id/editar',
          component: HomeServiceEditRouteComponent,
          resolve: { item: createItemResolver(ServicesService), },
          title: titleDetailResolver(ServicesService, FormUse.EDIT),
          data: { breadcrumb: [ 'Servicios', 'Editar' ], title: 'Editar Servicio' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Productos
        {
          path: 'productos',
          component: HomeProductsCatalogRouteComponent,
          title: titleCatalogResolver(ProductsService),
          data: { breadcrumb: 'Productos', title: 'Productos' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'productos/nuevo',
          component: HomeProductCreateRouteComponent,
          title: titleDetailResolver(ProductsService, FormUse.CREATE),
          data: { breadcrumb: [ 'Productos', 'Nuevo Producto' ], title: 'Nuevo Producto' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'productos/:id',
          component: HomeProductDetailRouteComponent,
          resolve: { item: createItemResolver(ProductsService), },
          title: titleDetailResolver(ProductsService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Productos', 'Ver Producto' ], title: 'Ver Detalle de Producto' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'productos/:id/editar',
          component: HomeProductEditRouteComponent,
          resolve: { item: createItemResolver(ProductsService), },
          title: titleDetailResolver(ProductsService, FormUse.EDIT),
          data: { breadcrumb: [ 'Productos', 'Editar' ], title: 'Editar Producto' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Pedidos
        {
          path: 'pedidos',
          component: HomeOrdersCatalogRouteComponent,
          title: titleCatalogResolver(OrdersService),
          data: { breadcrumb: 'Pedidos', title: 'Pedidos' },
        },
        {
          path: 'pedidos/nuevo',
          component: HomeOrderCreateRouteComponent,
          title: titleDetailResolver(OrdersService, FormUse.CREATE),
          data: { breadcrumb: [ 'Pedidos', 'Nuevo Pedido' ], title: 'Nuevo Pedido' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'pedidos/:id',
          component: HomeOrderDetailRouteComponent,
          resolve: { item: createItemResolver(OrdersService), },
          title: titleDetailResolver(OrdersService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Pedidos', 'Ver Pedido' ], title: 'Ver Detalle de Pedido' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'pedidos/:id/editar',
          component: HomeOrderEditRouteComponent,
          resolve: { item: createItemResolver(OrdersService), },
          title: titleDetailResolver(OrdersService, FormUse.EDIT),
          data: { breadcrumb: [ 'Pedidos', 'Editar' ], title: 'Editar Pedido' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Recetas
        {
          path: 'recetas',
          component: HomePrescriptionsCatalogRouteComponent,
          title: titleCatalogResolver(PrescriptionsService),
          data: { breadcrumb: 'Recetas', title: 'Recetas' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'recetas/nuevo',
          component: HomePrescriptionCreateRouteComponent,
          resolve: { item: () => null, },
          title: titleDetailResolver(PrescriptionsService, FormUse.CREATE),
          data: { breadcrumb: [ 'Recetas', 'Nueva Receta' ], title: 'Nueva Receta' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'recetas/:id',
          component: HomePrescriptionDetailRouteComponent,
          resolve: { item: createItemResolver(PrescriptionsService), },
          title: titleDetailResolver(PrescriptionsService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Recetas', 'Ver Receta' ], title: 'Ver Detalle de Receta' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'recetas/:id/editar',
          component: HomePrescriptionEditRouteComponent,
          resolve: { item: createItemResolver(PrescriptionsService), },
          title: titleDetailResolver(PrescriptionsService, FormUse.EDIT),
          data: { breadcrumb: [ 'Recetas', 'Editar' ], title: 'Editar Receta' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Clinicas
        {
          path: 'clinicas',
          component: HomeClinicsCatalogRouteComponent,
          title: titleCatalogResolver(ClinicsService),
          data: { breadcrumb: 'Clinicas', title: 'Clinicas' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'clinicas/nuevo',
          component: HomeClinicCreateRouteComponent,
          title: titleDetailResolver(ClinicsService, FormUse.CREATE),
          data: { breadcrumb: [ 'Clinicas', 'Nueva Clinica' ], title: 'Nueva Clinica' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'clinicas/:id',
          component: HomeClinicDetailRouteComponent,
          resolve: { item: createItemResolver(ClinicsService), },
          title: titleDetailResolver(ClinicsService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Clinicas', 'Ver Clinica' ], title: 'Ver Detalle de Clinica' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'clinicas/:id/editar',
          component: HomeClinicEditRouteComponent,
          resolve: { item: createItemResolver(ClinicsService), },
          title: titleDetailResolver(ClinicsService, FormUse.EDIT),
          data: { breadcrumb: [ 'Clinicas', 'Editar' ], title: 'Editar Clinica' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Especialistas
        {
          path: 'especialistas',
          component: HomeNursesCatalogRouteComponent,
          title: titleCatalogResolver(NursesService),
          data: { breadcrumb: 'Especialistas', title: 'Especialistas' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'especialistas/nuevo',
          component: HomeNurseCreateRouteComponent,
          title: titleDetailResolver(NursesService, FormUse.CREATE),
          data: { breadcrumb: [ 'Especialistas', 'Nuevo Especialista' ], title: 'Nuevo Especialista' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'especialistas/:id',
          component: HomeNurseDetailRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, FormUse.DETAIL),
          data: { breadcrumb: [ 'Especialistas', 'Ver Especialista' ], title: 'Ver Detalle de Especialista' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        {
          path: 'especialistas/:id/editar',
          component: HomeNurseEditRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, FormUse.EDIT),
          data: { breadcrumb: [ 'Especialistas', 'Editar' ], title: 'Editar Especialista' },
          runGuardsAndResolvers: 'always',
          canActivate: [ doctorGuard ]
        },
        // Farmacia
        {
          path: "farmacia",
          component: HomePharmacyCatalogRouteComponent,
          title: titleCatalogResolver(PharmaciesService),
          data: { breadcrumb: 'Farmacia', title: 'Farmacia' },
        },
      ],
    },
  ]) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
