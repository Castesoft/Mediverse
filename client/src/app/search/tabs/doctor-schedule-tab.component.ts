import { CommonModule } from '@angular/common';
import { Component, effect, inject, model, ModelSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorResult } from 'src/app/_models/doctors/doctorResults/doctorResult';
import { Search } from 'src/app/_models/search/search';
import { getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';
import { SearchService } from 'src/app/_services/search.service';
import {
  DoctorScheduleOptionComponent
} from "src/app/search/components/doctor-schedule-option/doctor-schedule-option.component";

@Component({
  selector: 'div[doctorScheduleTab]',
  templateUrl: './doctor-schedule-tab.component.html',
  styleUrls: [ './doctor-schedule-tab.component.scss' ],
  imports: [ CommonModule, RouterModule, DoctorScheduleOptionComponent ],
})
export class DoctorScheduleTabComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  readonly service: SearchService = inject(SearchService);

  readonly doctor: ModelSignal<DoctorResult | null> = model.required();
  readonly selectedTime: ModelSignal<AvailableTime | null> = model.required();
  readonly selectedSchedule: ModelSignal<AvailableDay | null> = model.required();

  readonly selectedDay: WritableSignal<AvailableDay | null> = signal(null);
  readonly schedule: WritableSignal<AvailableDay[]> = signal([]);

  constructor() {
    effect(() => {
      const currentDoctor: DoctorResult | null = this.doctor();
      if (currentDoctor !== null) {
        const searchDayNumber: number | null = this.service.search().dayNumber;
        const foundDay: AvailableDay | undefined = currentDoctor.availableDays.find(
          (day: AvailableDay) => day.dayNumber === searchDayNumber
        );
        this.selectedDay.set(foundDay || null);
      }
    });
  }

  ngOnInit(): void {
    this.updateSchedules();
  }

  /**
   * Called when a user selects a day.
   */
  selectDay(day: AvailableDay): void {
    Object.setPrototypeOf(day, AvailableDay.prototype);

    if (this.selectedDay() !== day) {
      this.selectedDay.set(day);
      this.selectedTime.set(null);
    }

    const updatedSearch = new Search(this.service.search().key, {
      ...this.service.search(),
      dayNumber: day.dayNumber,
      scheduleOption: day.findIndex(this.selectedTime()),
    });
    this.service.search.set(updatedSearch);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(updatedSearch),
      queryParamsHandling: 'merge',
    }).then(() => {});
  }

  /**
   * Called when a user selects an appointment time for a given day.
   */
  scheduleAppointment(day: AvailableDay, time: AvailableTime): void {
    Object.setPrototypeOf(day, AvailableDay.prototype);
    this.selectedSchedule.set(new AvailableDay({ ...day, availableTimes: [ time ] }));

    if (this.selectedTime() === time) {
      this.selectedTime.set(null);
    } else {
      this.selectedTime.set(time);
    }

    this.service.search.update((oldSearch: Search) => {
      return new Search(oldSearch.key, {
        ...oldSearch,
        scheduleOption: day.findIndex(this.selectedTime()),
      });
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.service.search()),
      queryParamsHandling: 'merge',
    }).then(() => {});
  }

  /**
   * Update the list of available schedules based on the selected doctor.
   */
  updateSchedules(): void {
    const currentDoctor: DoctorResult | null = this.doctor();
    if (!currentDoctor) return;

    this.schedule.set(currentDoctor.availableDays.map((day: AvailableDay) => new AvailableDay({ ...day })));

    const schedules = this.schedule();
    if (!this.selectedDay()) {
      if (this.service.search().dayNumber) {
        const dayFromSearch = schedules.find((day: AvailableDay) => day.dayNumber === this.service.search().dayNumber);
        this.selectedDay.set(dayFromSearch || schedules[0]);
      } else {
        this.selectedDay.set(new AvailableDay({ ...schedules[0] }));
      }
      this.service.search.set(new Search(this.service.search().key, {
        ...this.service.search(),
        dayNumber: this.selectedDay()!.dayNumber,
      }));
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
      }).then(() => {});
    }
  }
}
