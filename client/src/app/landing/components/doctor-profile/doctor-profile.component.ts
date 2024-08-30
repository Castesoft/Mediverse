import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { DoctorGeneralTabComponent } from '../doctor-general-tab/doctor-general-tab.component';
import { DoctorReviewsTabComponent } from '../doctor-reviews-tab/doctor-reviews-tab.component';
import { DoctorScheduleTabComponent } from '../doctor-schedule-tab/doctor-schedule-tab.component';
import { DoctorScheduleComponent } from '../doctor-schedule/doctor-schedule.component';
import { SearchService } from 'src/app/_services/search.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [
    UserProfilePictureComponent,
    DoctorGeneralTabComponent,
    DoctorReviewsTabComponent,
    DoctorScheduleTabComponent,
    DoctorScheduleComponent
  ],
  templateUrl: './doctor-profile.component.html'
})
export class DoctorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);

  doctor: DoctorSearchResult | null = null;
  activeTab = 'general';
  isScheduling = false;
  selectedSchedule: any;

  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.searchService.getDoctorById(+doctorId).subscribe(
        doctor => {
            console.log(doctor);
            this.doctor = doctor
        } 
      );
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
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
}