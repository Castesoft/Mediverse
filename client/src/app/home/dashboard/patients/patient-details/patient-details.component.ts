import { Component, OnInit, ViewChild } from '@angular/core';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/_models/appointment';
import { Patient } from 'src/app/_models/patient';

@Component({
  selector: 'patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  id!: number;
  item?: Patient;
  appointments: Appointment[] = [];
  appointmentsToShow: Appointment[] = [];

  selectedDate: Date = new Date();

  activeTabId: string = 'tab1';

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  isDetailsCollapsed: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.id = +this.route.snapshot.paramMap.get('id')!;

    // const patient = patients.find((item) => item.id === this.id);

    // if (patient) {
    //   this.item = patient;
    // } else {
    //   console.error('Patient not found');
    // }

    // const patientAppointments = appointments.filter(
    //   (item) => item.patient.id === this.id
    // );

    // if (patientAppointments) {
    //   this.appointments = patientAppointments;
    // } else {
    //   console.error('Appointments not found');
    // }
  }

  onSelect(data: TabDirective) {
    if (data.id) {
      console.log('Selected Tab Id: ', data.id);
      this.activeTabId = data.id;
    }
  }

  onSelectedDateChange(date: Date) {
    this.selectedDate = date;
    this.appointmentsToShow = this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  }

  getNextMonth() {
    const result = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayAppointments = this.appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getDate() === date.getDate() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getFullYear() === date.getFullYear()
        );
      });
      const hasAppointments = dayAppointments.length > 0;
      const numberOfAppointments = dayAppointments.length;
      console.log(date, hasAppointments, numberOfAppointments);
      result.push({
        date: date,
        hasAppointments: hasAppointments,
        numberOfAppointments: numberOfAppointments,
      });
    }
    return result;
  }
}
