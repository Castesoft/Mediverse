import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipurposeComponent } from 'src/app/home/dashboard/multipurpose.component';
import { StoreAnalyticsComponent } from 'src/app/home/dashboard/store-analytics.component';
import { LogisticsComponent } from 'src/app/home/dashboard/logistics.component';
import { ProjectsComponent } from 'src/app/home/dashboard/projects.component';
import { DashboardRoutingModule } from 'src/app/home/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'src/app/home/dashboard/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MultipurposeComponent,
    StoreAnalyticsComponent,
    LogisticsComponent,
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
