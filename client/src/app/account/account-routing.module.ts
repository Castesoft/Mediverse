import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
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
import { AccountEventsComponent } from "src/app/account/components/account-events/account-events.component";
import {
  AccountSubscriptionsComponent
} from "src/app/account/components/account-subscriptions/account-subscriptions.component";
import { doctorGuard } from "src/app/_guards/doctor.guard";
import {
  AccountNotificationsComponent
} from "src/app/account/components/account-notifications/account-notifications.component";

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
        title: 'DocHub | Mi Cuenta',
        data: { breadcrumb: 'Mi Cuenta' },
      },
      {
        path: 'expediente',
        component: AccountClinicalHistoryComponent,
        title: 'DocHub | Historial Clínico',
        data: { breadcrumb: 'Historial Clínico' },
      },
      {
        path: 'configuracion',
        component: AccountSettingsComponent,
        title: 'DocHub | Configuración',
        data: { breadcrumb: 'Configuración' },
      },
      {
        path: 'facturacion',
        component: AccountBillingComponent,
        title: 'DocHub | Facturación',
        data: { breadcrumb: 'Facturación' },
      },
      {
        path: 'pagos',
        component: AccountPaymentsComponent,
        title: 'DocHub | Pagos',
        data: { breadcrumb: 'Pagos' },
      },
      {
        path: 'seguros',
        component: AccountInsurancesComponent,
        title: 'DocHub | Seguros',
        data: { breadcrumb: 'Seguros' },
      },
      {
        path: 'agenda',
        component: AccountSchedulesComponent,
        title: 'DocHub | Horarios',
        data: { breadcrumb: 'Horarios' },
        canActivate: [ doctorGuard ],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'citas',
        component: AccountEventsComponent,
        title: 'DocHub | Citas',
        data: { breadcrumb: 'Citas' },
      },
      {
        path: 'suscripcion',
        component: AccountSubscriptionsComponent,
        title: 'DocHub | Suscripción',
        data: { breadcrumb: 'Suscripción' },
        canActivate: [ doctorGuard ],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'notificaciones',
        component: AccountNotificationsComponent,
        title: 'DocHub | Notificaciones',
        data: { breadcrumb: 'Notificaciones' },
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AccountRoutingModule {}
