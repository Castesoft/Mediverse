import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from 'src/app/admin/admin.component';
import { AdminOrdersCatalogRouteComponent } from "./routes/orders/admin-orders-catalog-route.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'pedidos',
            component: AdminOrdersCatalogRouteComponent,
            title: 'Pedidos | Catálogo',
            data: { breadcrumb: 'Pedidos', title: 'Administrar Pedidos', },
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule,
  ]
})
export class AdminRoutingModule {}
