import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from 'src/app/account/account.component';
import { AppointmentDetailsComponent } from 'src/app/home/dashboard/appointments/appointment-details/appointment-details.component';
import { AppointmentsComponent } from 'src/app/home/dashboard/appointments/appointments.component';
import { LogisticsComponent } from 'src/app/home/dashboard/logistics.component';
import { MultipurposeComponent } from 'src/app/home/dashboard/multipurpose.component';
import { OverviewComponent } from 'src/app/home/dashboard/overview.component';
import { PaymentsComponent } from 'src/app/home/dashboard/payments/payments.component';
import { ProjectsComponent } from 'src/app/home/dashboard/projects.component';
import { StoreAnalyticsComponent } from 'src/app/home/dashboard/store-analytics.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  // {
  //   path: 'prescriptions',
  //   loadChildren: () =>
  //     import('.').then(
  //       (m) => m.PrescriptionsModule
  //     ),
  // },
  // {
  //   path: 'medicines',
  //   loadChildren: () =>
  //     import('./../../medicines/medicines.module').then(
  //       (m) => m.MedicinesModule
  //     ),
  // },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'appointments/:id', component: AppointmentDetailsComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'account', component: AccountComponent },
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
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
