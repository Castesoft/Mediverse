import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { AccountCardComponent } from 'src/app/account/components/account-card.component';
import { MainAsideComponent } from 'src/app/_shared/template/components/main-aside.component';
import { AccountComponent } from "src/app/account/account.component";
import { AccountRoutingModule } from "src/app/account/account-routing.module";
import { MaterialModule } from 'src/app/_shared/material.module';
import {
  DashboardSidenavComponent
} from "src/app/_shared/components/dashboard/dashboard-sidenav/dashboard-sidenav.component";
import {
  DashboardToolbarComponent
} from "src/app/_shared/components/dashboard/dashboard-toolbar/dashboard-toolbar.component";
import { BreadcrumbsComponent } from "src/app/_shared/components/breadcrumbs.component";

@NgModule({
  declarations: [ AccountComponent ],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    BootstrapModule,
    CdkModule,
    TemplateModule,
    AccountCardComponent,
    MainAsideComponent,
    MaterialModule,
    DashboardSidenavComponent,
    DashboardToolbarComponent,
    BreadcrumbsComponent,
  ]
})
export class AccountModule {}
