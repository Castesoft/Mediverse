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

@NgModule({
  declarations: [
    AdminComponent,
    AdminOrdersCatalogRouteComponent
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
  ],
})
export class AdminModule {}
