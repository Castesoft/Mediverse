import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Appointment } from '../../../../types';
import { appointments } from '../../../../data/appointments';

@Component({
  selector: 'appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent implements OnInit {
  id!: number;
  item?: Appointment;

  tax?: number;
  total?: number;

  activeTabId: string = 'tab1';

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;

    const appointment = appointments.find((item) => item.id === this.id);

    if (appointment) {
      this.item = appointment;

      this.tax =
        appointment.paymentBilling.services.reduce(
          (acc, service) => acc + service.price,
          0
        ) * 0.16;

      this.total =
        appointment.paymentBilling.services.reduce(
          (acc, service) => acc + service.price,
          0
        ) + this.tax;
    } else {
      console.error('Appointment not found');
    }
  }

  onSelect(data: TabDirective): void {
    if (data.id) {
      console.log('Selected Tab Id: ', data.id);
      this.activeTabId = data.id;
    }
  }
}
