import { Component, input, output, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
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
  service = inject(SearchService);

  startingTab = input<string>();
  isMobile = input<boolean>(false);
  onClose = output();
  onEventCreated = output();
  selectedTab = 'general';
  scheduleWindowOpen = signal(false);
  selectedSchedule = signal<AvailableDay | null>(null);

  constructor() {
    effect(() => {
      if (this.service.selected()) {
        this.scheduleWindowOpen.set(false);
      }
    })
  }

  ngOnInit() {
    this.selectedTab = this.startingTab() ?? 'general';
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
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
