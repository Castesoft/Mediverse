import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentCheckoutComponent } from 'src/app/payment-checkout/payment-checkout.component';
import {
  PaymentCheckoutSuccessComponent
} from "src/app/payment-checkout/payment-checkout-success/payment-checkout-success.component";

const routes: Routes = [
  {
    path: 'cita/exito',
    pathMatch: 'full',
    component: PaymentCheckoutSuccessComponent,
    data: { title: 'Pago de Cita Exitoso' }
  },
  {
    path: 'cita/:id',
    component: PaymentCheckoutComponent,
    data: { title: 'Pago de Cita' }
  },
  {
    path: 'receta/:id',
    component: PaymentCheckoutComponent,
    data: { title: 'Pago de Receta' }
  },
  {
    path: 'medicamentos/:orderId',
    component: PaymentCheckoutComponent,
    data: { title: 'Pago de Medicamentos' }
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PaymentsRoutingModule {}
