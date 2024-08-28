import { Component, input, output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorAvailability, DoctorSearchResult } from 'src/app/_models/doctorSearchResults';

@Component({
  selector: 'app-doctor-schedule-tab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-schedule-tab.component.html',
  styleUrl: './doctor-schedule-tab.component.scss'
})
export class DoctorScheduleTabComponent {

  onSelectSchedule = output<any>();
  doctor = input<DoctorSearchResult>();

  selectedDay: any = null;
  schedule: DoctorAvailability[] = [];

  selectDay(day: any) {
    this.selectedDay = day;
  }

  scheduleAppointment(day: any, time: any) {
    this.onSelectSchedule.emit({ day, time });
  }

  ngOnInit() {
    this.schedule = this.doctor()?.doctorAvailabilities ?? [];
    this.selectedDay = this.schedule[0];
  }
}
