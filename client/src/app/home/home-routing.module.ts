import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeClinicsCatalogRouteComponent } from 'src/app/home/components/home-clinics-catalog-route.component';
import { HomeEventsCatalogRouteComponent } from 'src/app/home/components/home-events-catalog-route.component';
import { HomePatientsCatalogRouteComponent } from 'src/app/home/components/home-patients-catalog-route.component';
import { HomeProductsCatalogRouteComponent } from 'src/app/home/components/home-products-catalog-route.component';
import { HomeServicesCatalogRouteComponent } from 'src/app/home/components/home-services-catalog-route.component';
import { HomeComponent } from './home.component';


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
          path: 'citas',
          component: HomeEventsCatalogRouteComponent,
        },
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
        // {
        //   path: 'nurses',
        // },
        {
          path: 'clinicas',
          component: HomeClinicsCatalogRouteComponent,
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
