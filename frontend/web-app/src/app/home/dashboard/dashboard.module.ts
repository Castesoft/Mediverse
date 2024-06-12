import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MultipurposeComponent } from './multipurpose.component';
import { StoreAnalyticsComponent } from './store-analytics.component';
import { LogisticsComponent } from './logistics.component';
import { ProjectsComponent } from './projects.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';


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

    CoreModule,
    SharedModule,
  ]
})
export class DashboardModule { }
