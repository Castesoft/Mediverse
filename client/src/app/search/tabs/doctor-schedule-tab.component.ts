import { CommonModule } from '@angular/common';
import { Component, inject, effect, model, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { Search } from "src/app/_models/search/search";
import { getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';
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

  doctor = model.required<DoctorResult | null>();
  selectedSchedule = model.required<AvailableDay | null>();
  selectedTime = model.required<AvailableTime | null>();

  selectedDay = signal<AvailableDay | null>(null);
  schedule = signal<AvailableDay[]>([]);

  constructor() {
    effect(() => {
      console.log('doctor', this.doctor());

      if (this.doctor() !== null) {
        // this.
        // this.selectedDay.set(null);
        this.selectedDay.set(this.doctor()!.availableDays.find(x => x.dayNumber === this.service.search().dayNumber) || null);
      }

    });
  }

  ngOnInit(): void {
    this.updateSchedules();
  }

  selectDay(day: AvailableDay) {
    Object.setPrototypeOf(day, AvailableDay.prototype);

    if (this.selectedDay() !== day) {
      this.selectedDay.set(day);
      this.selectedTime.set(null);
    }

    this.service.search.set(new Search(this.service.search().key, {
      ...this.service.search(),
      dayNumber: day.dayNumber,
      scheduleOption: day.findIndex(this.selectedTime())
    }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.service.search()),
      queryParamsHandling: 'merge'
    });
  }

  scheduleAppointment(day: AvailableDay, time: AvailableTime) {
    Object.setPrototypeOf(day, AvailableDay.prototype);
    this.selectedSchedule.set(new AvailableDay({ ...day, availableTimes: [time] }));


    if (this.selectedTime() === time) {
      this.selectedTime.set(null);
    } else {
      this.selectedTime.set(time);
    }

    // console.log('selected time', this.selectedTime());

    this.service.search.update(oldValues => {
      const newValues = new Search(oldValues.key, { ...oldValues, scheduleOption: day.findIndex(this.selectedTime()) });

      // if (this.selectedTime() === null) {
      //   newValues.scheduleOption = null;
      // } else {
      //   newValues.scheduleOption = day.findIndex(time);
      // }

      return newValues;
    });

    console.log('schedule appointment', this.service.search());


    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.service.search()),
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
          this.service.search.set(new Search(this.service.search().key, { ...this.service.search(), dayNumber: this.selectedDay()!.dayNumber }));
        } else {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
      }

    }
  }
}
