import { Component } from '@angular/core';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'div[activeSubscriptionCard]',
  templateUrl: './active-subscription-card.component.html',
  imports: [
    DatePipe
  ],
  styleUrls: [ './active-subscription-card.component.scss' ]
})
export class ActiveSubscriptionCardComponent {
  fechaActiva: Date;
  fechaInicio: Date;
  siguienteFechaFacturacion: Date;

  constructor() {
    this.fechaActiva = new Date();
    this.fechaInicio = new Date(2023, 2, 1);
    this.siguienteFechaFacturacion = new Date(this.fechaActiva);
    this.siguienteFechaFacturacion.setMonth(this.fechaActiva.getMonth() + 1);
  }
}
