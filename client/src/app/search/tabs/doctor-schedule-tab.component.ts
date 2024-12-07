import { CommonModule } from '@angular/common';
import { Component, output, inject, effect, model, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { Search } from "src/app/_models/search/search";
import { SearchService } from 'src/app/_services/search.service';

@Component({
  selector: 'div[doctorScheduleTab]',
  templateUrl: './doctor-schedule-tab.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule,],
})
export class DoctorScheduleTabComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  service = inject(SearchService);

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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { dayNumber: day.dayNumber },
      queryParamsHandling: 'merge'
    });

    this.service.search.set(new Search({
      ...this.service.search(),
      dayNumber: day.dayNumber
    }));
  }

  scheduleAppointment(day: AvailableDay, time: AvailableTime) {
    this.selectedSchedule.set(new AvailableDay({ ...day, availableTimes: [time] }));

    this.service.search.set(new Search({ ...this.service.search(), scheduleOption: day.findIndex(time) }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.service.search().params,
      queryParamsHandling: 'merge'
    });
  }

  updateSchedules() {
    const doctor = this.doctor();
    if (doctor) {
      this.schedule.set(doctor.availableDays.map(d => new AvailableDay({...d})));
      const schedule = this.schedule();
        if (!this.selectedDay()) {
          if (this.service.search().dayNumber) {
            this.selectedDay.set(schedule.find(d => d.dayNumber === this.service.search().dayNumber) || schedule[0]);
          } else {
            this.selectedDay.set(new AvailableDay({ ...schedule[0] }));
          }
          this.service.search.set(new Search({ ...this.service.search(), dayNumber: this.selectedDay()!.dayNumber }));
        } else {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
      }

    }
  }
}
