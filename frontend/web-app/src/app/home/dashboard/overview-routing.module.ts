import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LogisticsComponent } from './logistics.component';
import { MultipurposeComponent } from './multipurpose.component';
import { StoreAnalyticsComponent } from './store-analytics.component';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: 'logistics',
    component: LogisticsComponent,
  },
  {
    path: 'multipurpose',
    component: MultipurposeComponent,
  },
  {
    path: 'store-analytics',
    component: StoreAnalyticsComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
