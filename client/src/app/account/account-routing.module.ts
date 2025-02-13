import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes, ResolveFn } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountOverviewComponent } from 'src/app/account/components/account-overview/account-overview.component';
import {
  AccountClinicalHistoryComponent
} from 'src/app/account/components/account-clinical-history/account-clinical-history.component';
import { AccountSettingsComponent } from 'src/app/account/components/account-settings/account-settings.component';
import { AccountBillingComponent } from 'src/app/account/components/account-billing/account-billing.component';
import { AccountPaymentsComponent } from 'src/app/account/components/account-payments/account-payments.component';
import { AccountInsurancesComponent } from 'src/app/account/components/account-insurances/account-insurances.component';
import { AccountSchedulesComponent } from 'src/app/account/components/account-schedules/account-schedules.component';
import { AccountService } from 'src/app/_services/account.service';
import { Account } from 'src/app/_models/account/account';
import {
  AccountEventsComponent
} from "src/app/account/components/account-events/account-events.component";

export const itemResolver: ResolveFn<Account | null> = () => {
  const service: AccountService = inject(AccountService);
  return service.current();
};

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    resolve: { item: itemResolver },
    children: [
      {
        path: '',
        component: AccountOverviewComponent,
        data: { breadcrumb: 'Mi Cuenta' },
        title: 'Mi Cuenta'
      },
      {
        path: 'expediente',
        component: AccountClinicalHistoryComponent,
        data: { breadcrumb: 'Historial Clínico' },
        title: 'Historial Clínico'
      },
      {
        path: 'configuracion',
        component: AccountSettingsComponent,
        data: { breadcrumb: 'Configuración' },
        title: 'Configuración'
      },
      {
        path: 'facturacion',
        component: AccountBillingComponent,
        data: { breadcrumb: 'Facturación' },
        title: 'Facturación'
      },
      {
        path: 'pagos',
        component: AccountPaymentsComponent,
        data: { breadcrumb: 'Pagos' },
        title: 'Pagos'
      },
      {
        path: 'seguros',
        component: AccountInsurancesComponent,
        data: { breadcrumb: 'Seguros' },
        title: 'Seguros'
      },
      {
        path: 'agenda',
        component: AccountSchedulesComponent,
        data: { breadcrumb: 'Horarios' },
        title: 'Horarios'
      },
      {
        path: 'citas',
        component: AccountEventsComponent,
        data: { breadcrumb: 'Citas' },
        title: 'Citas'
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AccountRoutingModule {}
