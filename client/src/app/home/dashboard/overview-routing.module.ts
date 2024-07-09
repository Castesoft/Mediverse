import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogisticsComponent } from 'src/app/home/dashboard/logistics.component';
import { MultipurposeComponent } from 'src/app/home/dashboard/multipurpose.component';
import { ProjectsComponent } from 'src/app/home/dashboard/projects.component';
import { StoreAnalyticsComponent } from 'src/app/home/dashboard/store-analytics.component';

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
