import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeClinicsCatalogRouteComponent } from 'src/app/home/components/home-clinics-catalog-route.component';
import { HomeEventsCatalogRouteComponent } from 'src/app/home/components/home-events-catalog-route.component';
import { HomePatientsCatalogRouteComponent } from 'src/app/home/components/home-patients-catalog-route.component';
import { HomeProductsCatalogRouteComponent } from 'src/app/home/components/home-products-catalog-route.component';
import { HomeServicesCatalogRouteComponent } from 'src/app/home/components/home-services-catalog-route.component';
import { HomeComponent } from './home.component';
import { HomePatientDetailRouteComponent } from 'src/app/home/components/home-patient-detail-route.component';
import createItemResolver from 'src/app/_utils/serviceHelper/functions/createItemResolver';
import { PatientsService } from 'src/app/patients/patients.config';
import { EventsService } from 'src/app/events/events.config';
import { HomeEventDetailRouteComponent } from 'src/app/home/components/home-event-detail-route.component';
import titleDetailResolver from 'src/app/_utils/serviceHelper/functions/titleDetailResolver';
import titleCatalogResolver from 'src/app/_utils/serviceHelper/functions/titleCatalogResolver';
import { HomeEventCreateRouteComponent } from 'src/app/home/components/home-event-create-route.component';
import { NursesService } from 'src/app/nurses/nurses.config';
import { HomeNursesCatalogRouteComponent } from 'src/app/home/components/home-nurses-catalog-route.component';
import { HomeNurseDetailRouteComponent } from 'src/app/home/components/home-nurse-detail-route.component';
import { HomePatientCreateRouteComponent } from 'src/app/home/components/home-patient-create-route.component';


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
        },
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
        // {
        //   path: 'citas/:id/edit',

        // },
        {
          path: 'servicios',
          component: HomeServicesCatalogRouteComponent,
        },
        {
          path: 'productos',
          component: HomeProductsCatalogRouteComponent,
        }, {
          path: 'pedidos',
          loadChildren: () => import('../orders/orders.config').then(x => x.OrdersModule)
        },
        {
          path: 'prescriptions',
          loadChildren: () => import('../prescriptions/prescriptions.config').then(x => x.PrescriptionsModule)
        },
        {
          path: 'clinicas',
          component: HomeClinicsCatalogRouteComponent,
        },
        {
          path: 'especialistas',
          component: HomeNursesCatalogRouteComponent,
          title: titleCatalogResolver(NursesService),
        },
        {
          path: 'espacialistas/:id',
          component: HomeNurseDetailRouteComponent,
          resolve: { item: createItemResolver(NursesService), },
          title: titleDetailResolver(NursesService, 'detail'),
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
