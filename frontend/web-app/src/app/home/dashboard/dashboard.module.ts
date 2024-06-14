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
import { OverviewComponent } from './overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppointmentSummaryComponent } from './components/appointment-summary/appointment-summary.component';
import { AppointmentDetailsComponent } from './appointments/appointment-details/appointment-details.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentServicesSummaryComponent } from './appointments/appointment-services-summary/appointment-services-summary.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailsComponent } from './patients/patient-details/patient-details.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MultipurposeComponent,
    StoreAnalyticsComponent,
    LogisticsComponent,
    ProjectsComponent,
    OverviewComponent,

    // Citas
    AppointmentsComponent,
    AppointmentDetailsComponent,
    AppointmentSummaryComponent,
    AppointmentServicesSummaryComponent,

    // Pacientes
    PatientsComponent,
    PatientDetailsComponent,

    // Recetas
    PrescriptionsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    CoreModule,
    SharedModule,
  ],
})
export class DashboardModule {}
