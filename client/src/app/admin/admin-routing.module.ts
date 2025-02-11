import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from 'src/app/admin/admin.component';
import { AdminOrdersCatalogRouteComponent } from "./routes/orders/admin-orders-catalog-route.component";
import { AdminOrderEditRouteComponent } from "src/app/admin/routes/orders/admin-order-edit-route.component";
import { OrdersService } from "src/app/orders/orders.config";
import createItemResolver from "src/app/_utils/serviceHelper/functions/createItemResolver";
import { AdminOrderCreateRouteComponent } from "src/app/admin/routes/orders/admin-order-create-route.component";
import {
  AdminProductsCatalogRouteComponent
} from "src/app/admin/routes/products/admin-products-catalog-route.component";
import { AdminUsersCatalogRouteComponent } from "src/app/admin/routes/users/admin-users-catalog-route.component";
import { AdminDoctorsCatalogRouteComponent } from "src/app/admin/routes/doctors/admin-doctors-catalog-route.component";
import { AdminProductCreateRouteComponent } from "src/app/admin/routes/products/admin-product-create-route.component";
import { AdminProductEditRouteComponent } from "src/app/admin/routes/products/admin-product-edit-route.component";
import { ProductsService } from "src/app/products/products.config";
import { HomePatientDetailRouteComponent } from "src/app/home/routes/patients/home-patient-detail-route.component";
import { PatientsService } from "src/app/patients/patients.config";
import titleDetailResolver from "src/app/_utils/serviceHelper/functions/titleDetailResolver";
import { FormUse } from "src/app/_models/forms/formTypes";
import { AdminProductDetailRouteComponent } from "src/app/admin/routes/products/admin-product-detail-route.component";
import { AdminOrderDetailRouteComponent } from "src/app/admin/routes/orders/admin-order-detail-route.component";
import {
  AdminWarehousesCatalogRouteComponent
} from "src/app/admin/routes/warehouses/admin-warehouses-catalog-route.component";
import {
  AdminWarehouseCreateRouteComponent
} from "src/app/admin/routes/warehouses/admin-warehouse-create-route.component";
import { WarehousesService } from "src/app/warehouses/warehouses.config";
import {
  AdminWarehouseDetailRouteComponent
} from "src/app/admin/routes/warehouses/admin-warehouse-detail-route.component";
import { AdminWarehouseEditRouteComponent } from "src/app/admin/routes/warehouses/admin-warehouse-edit-route.component";
import { AdminDoctorDetailRouteComponent } from "src/app/admin/routes/doctors/admin-doctors-detail-route.component";
import { UsersService } from "src/app/users/users.config";
import {
  AdminSubscriptionsCatalogRouteComponent
} from "src/app/admin/routes/subscriptions/admin-subscriptions-catalog-route.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          // Pedidos
          {
            path: 'pedidos',
            component: AdminOrdersCatalogRouteComponent,
            title: 'Pedidos | Catálogo',
            data: { breadcrumb: 'Pedidos', title: 'Administrar Pedidos', },
          },
          {
            path: 'pedidos/:id',
            component: AdminOrderDetailRouteComponent,
            title: 'Pedidos | Ver Detalle',
            data: { breadcrumb: [ 'Pedidos', 'Detalle' ], title: 'Detalle Pedido', },
            resolve: { item: createItemResolver(OrdersService) },
          },
          {
            path: 'pedidos/:id/editar',
            component: AdminOrderEditRouteComponent,
            title: 'Pedidos | Editar Pedido',
            data: { breadcrumb: [ 'Pedidos', 'Editar' ], title: 'Editar Pedido', },
            resolve: { item: createItemResolver(OrdersService) },
          },
          {
            path: 'pedidos/nuevo',
            component: AdminOrderCreateRouteComponent,
            title: 'Pedidos | Crear Pedido',
            data: { breadcrumb: [ 'Pedidos', 'Crear' ], title: 'Crear Pedido', },
          },
          // Productos
          {
            path: 'productos',
            component: AdminProductsCatalogRouteComponent,
            title: 'Productos | Catálogo',
            data: { breadcrumb: 'Productos', title: 'Administrar Productos', },
          },
          {
            path: 'productos/nuevo',
            component: AdminProductCreateRouteComponent,
            title: 'Productos | Crear Producto',
            data: { breadcrumb: [ 'Productos', 'Crear' ], title: 'Crear Producto', },
          },
          {
            path: 'productos/:id',
            component: AdminProductDetailRouteComponent,
            resolve: { item: createItemResolver(ProductsService), },
            title: 'Productos | Ver Detalle',
            data: { breadcrumb: [ 'Productos', 'Detalle' ], title: 'Detalle Producto', },
          },
          {
            path: 'productos/:id/editar',
            component: AdminProductEditRouteComponent,
            title: 'Productos | Editar Producto',
            data: { breadcrumb: [ 'Productos', 'Editar' ], title: 'Editar Producto', },
            resolve: { item: createItemResolver(ProductsService) },
          },
          // Almacenes
          {
            path: 'almacenes',
            component: AdminWarehousesCatalogRouteComponent,
            title: 'Almacenes | Catálogo',
            data: { breadcrumb: 'Almacenes', title: 'Administrar Almacenes', },
          },
          {
            path: 'almacenes/nuevo',
            component: AdminWarehouseCreateRouteComponent,
            title: 'Almacenes | Crear Almacén',
            data: { breadcrumb: [ 'Almacenes', 'Crear' ], title: 'Crear Almacén', },
          },
          {
            path: 'almacenes/:id',
            component: AdminWarehouseDetailRouteComponent,
            resolve: { item: createItemResolver(WarehousesService), },
            title: 'Almacenes | Ver Detalle',
            data: { breadcrumb: [ 'Almacenes', 'Detalle' ], title: 'Detalle Almacén', },
          },
          {
            path: 'almacenes/:id/editar',
            component: AdminWarehouseEditRouteComponent,
            title: 'Almacenes | Editar Almacén',
            data: { breadcrumb: [ 'Almacenes', 'Editar' ], title: 'Editar Almacén', },
            resolve: { item: createItemResolver(WarehousesService) },
          },
          // Usuarios
          {
            path: 'usuarios',
            component: AdminUsersCatalogRouteComponent,
            title: 'Usuarios | Administrar',
            data: { breadcrumb: 'Usuarios', title: 'Administrar Usuarios', },
          },
          // Doctores
          {
            path: 'doctores',
            component: AdminDoctorsCatalogRouteComponent,
            title: 'Doctores | Administrar',
            data: { breadcrumb: 'Doctores', title: 'Administrar Doctores', },
          },
          {
            path: 'doctores/:id',
            component: AdminDoctorDetailRouteComponent,
            title: 'Doctores | Ver Detalle',
            data: { breadcrumb: [ 'Doctores', 'Detalle' ], title: 'Detalle Doctor', },
            resolve: { item: createItemResolver(UsersService) },
          },
          // Subscriptions
          {
            path: 'suscripciones',
            component: AdminSubscriptionsCatalogRouteComponent,
            title: 'Suscripciones | Administrar',
            data: { breadcrumb: 'Suscripciones', title: 'Administrar Suscripciones', },
          }
          // Permisos
        ]
      }
    ])
  ],
  exports: [
    RouterModule,
  ]
})
export class AdminRoutingModule {}
