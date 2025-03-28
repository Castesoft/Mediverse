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
import { AccountEventsComponent } from 'src/app/account/components/account-events/account-events.component';
import {
  AccountSubscriptionsComponent
} from 'src/app/account/components/account-subscriptions/account-subscriptions.component';
import { doctorGuard } from 'src/app/_guards/doctor.guard';
import {
  AccountNotificationsComponent
} from 'src/app/account/components/account-notifications/account-notifications.component';
import {
  AccountEventDetailComponent
} from 'src/app/account/components/account-event-detail/account-event-detail.component';
import createItemResolver from 'src/app/_utils/serviceHelper/functions/createItemResolver';
import titleDetailResolver from 'src/app/_utils/serviceHelper/functions/titleDetailResolver';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { authGuard } from 'src/app/_guards/auth.guard';
import { EventsService } from "src/app/events/events.service";
import { AccountOrdersComponent } from "src/app/account/components/account-orders/account-orders.component";
import {
  AccountOrderDetailComponent
} from "src/app/account/components/account-order-detail/account-order-detail.component";
import { OrdersService } from "src/app/orders/orders.config";
import { nonDoctorGuard } from "src/app/_guards/non-doctor.guard";

export const itemResolver: ResolveFn<Account | null> = () => {
  const service: AccountService = inject(AccountService);
  return service.current();
};

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    resolve: { item: itemResolver },
    data: {
      breadcrumb: [ 'Cuenta' ],
      title: 'Mi Cuenta'
    },
    children: [
      {
        path: '',
        component: AccountOverviewComponent,
        title: 'DocHub | Mi Cuenta',
        data: {
          breadcrumb: [ 'Cuenta', 'Resumen' ],
          title: 'Mi Cuenta'
        }
      },
      {
        path: 'expediente',
        component: AccountClinicalHistoryComponent,
        title: 'DocHub | Historial Clínico',
        data: {
          breadcrumb: [ 'Cuenta', 'Expediente' ],
          title: 'Mi Historial Clínico'
        }
      },
      {
        path: 'configuracion',
        component: AccountSettingsComponent,
        title: 'DocHub | Configuración',
        data: {
          breadcrumb: [ 'Cuenta', 'Configuración' ],
          title: 'Configuración de Cuenta'
        }
      },
      {
        path: 'facturacion',
        component: AccountBillingComponent,
        title: 'DocHub | Facturación',
        data: {
          breadcrumb: [ 'Cuenta', 'Facturación' ],
          title: 'Información de Facturación'
        }
      },
      {
        path: 'pagos',
        component: AccountPaymentsComponent,
        title: 'DocHub | Pagos',
        data: {
          breadcrumb: [ 'Cuenta', 'Pagos' ],
          title: 'Mis Pagos'
        }
      },
      {
        path: 'seguros',
        component: AccountInsurancesComponent,
        title: 'DocHub | Seguros',
        data: {
          breadcrumb: [ 'Cuenta', 'Seguros' ],
          title: 'Mis Seguros'
        }
      },
      {
        path: 'agenda',
        component: AccountSchedulesComponent,
        title: 'DocHub | Horarios',
        data: {
          breadcrumb: [ 'Cuenta', 'Agenda' ],
          title: 'Mis Horarios'
        },
        canActivate: [ doctorGuard ],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'citas',
        component: AccountEventsComponent,
        title: 'DocHub | Mis Citas',
        data: {
          breadcrumb: [ 'Cuenta', 'Citas' ],
          title: 'Mis Citas'
        }
      },
      {
        path: 'citas/:id',
        component: AccountEventDetailComponent,
        resolve: { item: createItemResolver(EventsService) },
        data: {
          breadcrumb: [ 'Cuenta', 'Citas', 'Detalle' ],
          title: 'Detalle de Cita'
        },
        canActivate: [ authGuard ]
      },
      {
        path: 'pedidos',
        component: AccountOrdersComponent,
        title: 'DocHub | Mis Pedidos',
        data: {
          breadcrumb: [ 'Cuenta', 'Pedidos' ],
          title: 'Mis Pedidos'
        },
        canActivate: [ nonDoctorGuard ]
      },
      {
        path: 'pedidos/:id',
        component: AccountOrderDetailComponent,
        resolve: { item: createItemResolver(OrdersService) },
        title: titleDetailResolver(OrdersService, FormUse.DETAIL, 'id'),
        data: {
          breadcrumb: [ 'Cuenta', 'Pedidos', 'Detalle' ],
          title: 'Detalle de Pedido'
        },
        runGuardsAndResolvers: 'always',
        canActivate: [ authGuard ]
      },
      {
        path: 'suscripcion',
        component: AccountSubscriptionsComponent,
        title: 'DocHub | Suscripción',
        data: {
          breadcrumb: [ 'Cuenta', 'Suscripción' ],
          title: 'Suscripción'
        },
        canActivate: [ doctorGuard ],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'notificaciones',
        component: AccountNotificationsComponent,
        title: 'DocHub | Notificaciones',
        data: {
          breadcrumb: [ 'Cuenta', 'Notificaciones' ],
          title: 'Mis Notificaciones'
        }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AccountRoutingModule {}
