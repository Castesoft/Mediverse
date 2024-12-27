import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { SidebarTreeComponent } from 'src/app/_utils/sidebar/sidebar-tree.component';
import { SidebarComponent } from 'src/app/_utils/sidebar/sidebar.component';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';
import { AdminComponent } from 'src/app/admin/admin.component';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CdkModule,
    MaterialModule,
    SidebarComponent,
    SidebarTreeComponent,
  ],
})
export class AdminModule {}
