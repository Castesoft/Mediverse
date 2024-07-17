import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppointmentDetailsComponent } from 'src/app/home/dashboard/appointments/appointment-details/appointment-details.component';
import { AppointmentServicesSummaryComponent } from 'src/app/home/dashboard/appointments/appointment-services-summary/appointment-services-summary.component';
import { AppointmentsComponent } from 'src/app/home/dashboard/appointments/appointments.component';
import { AppointmentSummaryComponent } from 'src/app/home/dashboard/components/appointment-summary/appointment-summary.component';
import { DashboardRoutingModule } from 'src/app/home/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'src/app/home/dashboard/dashboard.component';
import { LogisticsComponent } from 'src/app/home/dashboard/logistics.component';
import { MultipurposeComponent } from 'src/app/home/dashboard/multipurpose.component';
import { OverviewComponent } from 'src/app/home/dashboard/overview.component';
import { PaymentsComponent } from 'src/app/home/dashboard/payments/payments.component';
import { ProjectsComponent } from 'src/app/home/dashboard/projects.component';
import { StoreAnalyticsComponent } from 'src/app/home/dashboard/store-analytics.component';
import {BootstrapModule} from "src/app/_shared/bootstrap.module";

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

        // Pagos
        PaymentsComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgApexchartsModule,
        BootstrapModule,
    ],
    exports: [
        AppointmentServicesSummaryComponent
    ]
})
export class DashboardModule {}
