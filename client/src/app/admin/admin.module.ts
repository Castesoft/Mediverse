import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { SidebarTreeComponent } from 'src/app/_utils/sidebar/sidebar-tree.component';
import { SidebarComponent } from 'src/app/_utils/sidebar/sidebar.component';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';
import { AdminComponent } from 'src/app/admin/admin.component';
import { AdminOrdersCatalogRouteComponent } from "./routes/orders/admin-orders-catalog-route.component";
import { BreadcrumbsComponent } from "../_shared/components/breadcrumbs.component";
import { PostComponent } from "../_shared/template/components/post.component";
import { OrdersCatalogComponent } from "../orders/orders-catalog.component";
import { ToolbarComponent } from "../_shared/template/components/toolbars/toolbar.component";
import { AdminOrderEditRouteComponent } from "src/app/admin/routes/orders/admin-order-edit-route.component";
import { AdminOrderCreateRouteComponent } from "src/app/admin/routes/orders/admin-order-create-route.component";
import { OrderFormComponent } from "src/app/orders/order-form.component";
import {
  AdminProductsCatalogRouteComponent
} from "src/app/admin/routes/products/admin-products-catalog-route.component";
import { AdminProductEditRouteComponent } from "src/app/admin/routes/products/admin-product-edit-route.component";
import { AdminProductCreateRouteComponent } from "src/app/admin/routes/products/admin-product-create-route.component";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";
import { ProductFormComponent } from "src/app/products/product-form.component";
import { AdminUsersCatalogRouteComponent } from "src/app/admin/routes/users/admin-users-catalog-route.component";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";
import { AdminDoctorsCatalogRouteComponent } from "src/app/admin/routes/doctors/admin-doctors-catalog-route.component";
import { AdminProductDetailRouteComponent } from "src/app/admin/routes/products/admin-product-detail-route.component";
import { AdminOrderDetailRouteComponent } from "src/app/admin/routes/orders/admin-order-detail-route.component";
import {
  AdminWarehousesCatalogRouteComponent
} from "src/app/admin/routes/warehouses/admin-warehouses-catalog-route.component";
import { WarehousesCatalogComponent } from "src/app/warehouses/warehouses-catalog.component";
import {
  AdminWarehouseCreateRouteComponent
} from "src/app/admin/routes/warehouses/admin-warehouse-create-route.component";
import {
  AdminWarehouseDetailRouteComponent
} from "src/app/admin/routes/warehouses/admin-warehouse-detail-route.component";
import { AdminWarehouseEditRouteComponent } from "src/app/admin/routes/warehouses/admin-warehouse-edit-route.component";
import { WarehouseFormComponent } from "src/app/warehouses/warehouse-form.component";
import { AdminDoctorDetailRouteComponent } from "src/app/admin/routes/doctors/admin-doctors-detail-route.component";
import { DoctorFormComponent } from "src/app/doctors/doctor-form.component";

@NgModule({
  declarations: [
    AdminComponent,
    AdminOrdersCatalogRouteComponent,
    AdminOrderEditRouteComponent,
    AdminOrderCreateRouteComponent,
    AdminOrderDetailRouteComponent,
    AdminProductsCatalogRouteComponent,
    AdminProductEditRouteComponent,
    AdminProductCreateRouteComponent,
    AdminProductDetailRouteComponent,
    AdminUsersCatalogRouteComponent,
    AdminDoctorsCatalogRouteComponent,
    AdminDoctorDetailRouteComponent,
    AdminWarehousesCatalogRouteComponent,
    AdminWarehouseCreateRouteComponent,
    AdminWarehouseDetailRouteComponent,
    AdminWarehouseEditRouteComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CdkModule,
    MaterialModule,
    SidebarComponent,
    SidebarTreeComponent,
    BreadcrumbsComponent,
    PostComponent,
    OrdersCatalogComponent,
    ToolbarComponent,
    OrderFormComponent,
    ProductsCatalogComponent,
    ProductFormComponent,
    UsersCatalogComponent,
    WarehousesCatalogComponent,
    WarehouseFormComponent,
    DoctorFormComponent,
  ],
})
export class AdminModule {}
