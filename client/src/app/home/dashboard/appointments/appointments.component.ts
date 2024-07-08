import { Component } from '@angular/core';
import { appointments } from '../../../data/appointments';

@Component({
  selector: 'appointments',
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent {
  appointments = appointments;
}
