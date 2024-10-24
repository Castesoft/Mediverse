import { CommonModule } from '@angular/common';
import { Component, output, inject, effect, model, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorResult } from 'src/app/_models/doctorResult';

@Component({
  selector: 'div[doctorScheduleTab]',
  templateUrl: './doctor-schedule-tab.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule,],
})
export class DoctorScheduleTabComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  onSelectSchedule = output<AvailableDay>();
  doctor = model.required<DoctorResult | null>();

  selectedDay = signal<AvailableDay | null>(null);
  schedule = signal<AvailableDay[]>([]);
  selectedSchedule = model.required<AvailableDay | null>();

  constructor() {

  }

  ngOnInit(): void {
    this.updateSchedules();
  }

  selectDay(day: AvailableDay) {
    this.selectedDay.set(day);
  }

  scheduleAppointment(day: AvailableDay, time: AvailableTime) {
    this.selectedSchedule.set(new AvailableDay({ ...day, availableTimes: [time] }));
  }

  updateSchedules() {
    const doctor = this.doctor();
    if (doctor) {
      this.schedule.set(doctor.availableDays.map(d => new AvailableDay({...d})));
      const schedule = this.schedule();
        this.selectedDay.set(new AvailableDay({ ...schedule.find(d => d.dayNumber === +this.route.snapshot.queryParams['day']) }));
        if (!this.selectedDay()) {
          this.selectedDay.set(new AvailableDay({ ...schedule[0] }));
        } else {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { day: null },
            queryParamsHandling: 'merge',
        });
      }
    }
  }
}
