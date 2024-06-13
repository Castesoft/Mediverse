import { Component, Input } from '@angular/core';
import { Service } from '../../../../types';

@Component({
  selector: 'appointment-services-summary',
  templateUrl: './appointment-services-summary.component.html',
})
export class AppointmentServicesSummaryComponent {
  @Input({ required: true }) item!: Service;
}
