import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LogisticsComponent } from './logistics.component';
import { MultipurposeComponent } from './multipurpose.component';
import { StoreAnalyticsComponent } from './store-analytics.component';
import { ProjectsComponent } from './projects.component';
import { OverviewComponent } from './overview.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentDetailsComponent } from './appointments/appointment-details/appointment-details.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailsComponent } from './patients/patient-details/patient-details.component';
import { AccountComponent } from '../account/account.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'appointments/:id', component: AppointmentDetailsComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/:id', component: PatientDetailsComponent },
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
