import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './groups/ngx-bootstrap.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountFooterComponent } from '../core/components/account/footer.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ScheduleSummaryCardComponent } from '../home/dashboard/components/schedule-summary-card/schedule-summary-card.component';



@NgModule({
  declarations: [
    AccountFooterComponent,
    ScheduleSummaryCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
  ],
  exports: [
    NgxBootstrapModule,

    RouterModule,
    FormsModule,
    ReactiveFormsModule,


    AccountFooterComponent,

    ScheduleSummaryCardComponent

  ]
})
export class SharedModule { }
