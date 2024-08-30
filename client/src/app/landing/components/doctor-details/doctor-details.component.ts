import { Component, input, output, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { UserProfilePictureComponent } from "../../../users/components/user-profile-picture/user-profile-picture.component";
import { DoctorGeneralTabComponent } from '../doctor-general-tab/doctor-general-tab.component';
import { DoctorScheduleTabComponent } from '../doctor-schedule-tab/doctor-schedule-tab.component';
import { DoctorReviewsTabComponent } from '../doctor-reviews-tab/doctor-reviews-tab.component';
import { DoctorScheduleComponent } from '../doctor-schedule/doctor-schedule.component';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [UserProfilePictureComponent, UserProfilePictureComponent, DoctorGeneralTabComponent, DoctorScheduleTabComponent, DoctorReviewsTabComponent, DoctorScheduleComponent],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.scss'
})
export class DoctorDetailsComponent {
  private router = inject(Router);
  doctor = input<DoctorSearchResult>();
  startingTab = input<string>();
  onClose = output();
  onEventCreated = output();

  constructor() { 
    effect(() => {
      if (this.doctor()) {
        this.isScheduling = false;
      }
    })
  }

  selectedTab = 'general';
  isScheduling = false;
  selectedSchedule: any;

  ngOnInit() {
    this.selectedTab = this.startingTab() ?? 'general';
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  selectSchedule(schedule: any) {
    this.isScheduling = true;
    this.selectedSchedule = schedule;
  }

  onCloseDoctorSchedule(event: boolean) {
    this.isScheduling = false;
    if (event) {
      // Handle successful scheduling (e.g., show a success message)
    }
  }

  navigateToDoctorProfile() {
    if (this.doctor()) {
      this.router.navigate(['/doctor', this.doctor()!.id]);
    }
  }
}
