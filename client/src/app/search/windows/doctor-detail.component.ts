import { Component, input, output, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
import { DoctorResult } from 'src/app/_models/doctorResult';
import { Search } from 'src/app/_models/search';
import { SearchService } from 'src/app/_services/search.service';
import { DoctorGeneralTabComponent } from 'src/app/search/tabs/doctor-general-tab.component';
import { DoctorReviewsTabComponent } from 'src/app/search/tabs/doctor-reviews-tab.component';
import { DoctorScheduleTabComponent } from 'src/app/search/tabs/doctor-schedule-tab.component';
import { DoctorScheduleComponent } from 'src/app/search/windows/doctor-schedule.component';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';

@Component({
  selector: 'div[doctorDetail]',
  standalone: true,
  imports: [UserProfilePictureComponent, UserProfilePictureComponent, DoctorGeneralTabComponent, DoctorScheduleTabComponent, DoctorReviewsTabComponent, DoctorScheduleComponent],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.scss'
})
export class DoctorDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  service = inject(SearchService);

  startingTab = input<string>();
  isMobile = input<boolean>(false);
  onEventCreated = output();
  scheduleWindowOpen = signal(false);
  selectedSchedule = signal<AvailableDay | null>(null);

  constructor() {
    effect(() => {
      let selected = this.service.selected();
      if (selected !== null && this.service.search().dayNumber !== null && this.service.search().scheduleOption !== null) {
        selected = new DoctorResult({...selected});
        const variable = selected.getAvailableDayByDayNumber(this.service.search().dayNumber!);
        this.selectedSchedule.set(variable);
        this.scheduleWindowOpen.set(true);
      } else {
        this.scheduleWindowOpen.set(false);
      }

      console.log('is open', this.scheduleWindowOpen());

    }, { allowSignalWrites: true, });
  }

  selectTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });

    this.service.search.set(new Search({
      ...this.service.search(),
      tab: tab
    }));
  }

  onClickClose() {
    this.service.setSelected(null);
  }

  selectSchedule(schedule: AvailableDay) {
    this.scheduleWindowOpen.set(true);
    this.selectedSchedule.set(schedule);
  }

  onCloseDoctorSchedule(event: boolean) {
    this.scheduleWindowOpen.set(false);
    if (event) {
      this.onEventCreated.emit();
    }
  }

  navigateToDoctorProfile() {
    if (this.service.selected()) {
      this.router.navigate(['/doctor', this.service.selected()!.id]);
    }
  }

  onSelectedScheduleChange(event: AvailableDay | null) {
    if (event) {
      this.scheduleWindowOpen.set(true);
    }
    // console.log('event', event!.availableTimes[0]);
    // console.log('current', this.selectedSchedule()!.availableTimes[0]);

  }
}
