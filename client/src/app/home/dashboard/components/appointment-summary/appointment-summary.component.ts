import { Component, Input } from '@angular/core';
import { Appointment } from 'src/app/_models/appointment';

@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
})
export class AppointmentSummaryComponent {
  @Input({ required: true }) item!: Appointment;
}
