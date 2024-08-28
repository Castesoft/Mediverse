import { Component, input, output, EventEmitter, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorAvailability, DoctorSearchResult } from 'src/app/_models/doctorSearchResults';

@Component({
  selector: 'app-doctor-schedule-tab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-schedule-tab.component.html',
  styleUrl: './doctor-schedule-tab.component.scss'
})
export class DoctorScheduleTabComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
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
    this.selectedDay = this.schedule.find(d => d.dayNumber === +this.route.snapshot.queryParams['day']);
    if (!this.selectedDay) {
      this.selectedDay = this.schedule[0];
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { day: null },
        queryParamsHandling: 'merge',
      });
    }
  }
}
