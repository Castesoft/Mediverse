import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { DoctorGeneralTabComponent } from '../doctor-general-tab/doctor-general-tab.component';
import { DoctorReviewsTabComponent } from '../doctor-reviews-tab/doctor-reviews-tab.component';
import { DoctorScheduleTabComponent } from '../doctor-schedule-tab/doctor-schedule-tab.component';
import { DoctorScheduleComponent } from '../doctor-schedule/doctor-schedule.component';
import { SearchService } from 'src/app/_services/search.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ShareModalComponent } from './share-modal/share-modal.component'; // You'll need to create this component

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
  private router = inject(Router);
  private searchService = inject(SearchService);
  private bsModalService = inject(BsModalService);

  doctor: DoctorSearchResult | null = null;
  activeTab = 'general';
  isScheduling = false;
  selectedSchedule: any;
  
  isMobile = signal(false);

  isShareModalOpen = false;
  shareUrl = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile.set(event.target.innerWidth <= 768);
  }

  ngOnInit() {
    this.isMobile.set(window.innerWidth <= 768);

    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.searchService.getDoctorById(+doctorId).subscribe(
        doctor => {
            this.doctor = doctor
        }
      );
    }

    this.shareUrl = window.location.href;

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  selectSchedule(schedule: any) {
    this.isScheduling = true;
    this.selectedSchedule = schedule;
  }

  onCloseDoctorSchedule(event: boolean) {
    this.isScheduling = false;
    if (event) {
      setTimeout(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { day: this.selectedSchedule.day.dayNumber },
          queryParamsHandling: 'merge'
        })
        location.reload();
      }, 10);
    }
  }

  openShareModal() {
    this.bsModalService.show(ShareModalComponent, {
      initialState: {
        doctor: this.doctor,
        shareUrl: this.shareUrl
      }
    });
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }

  shareProfile(platform: string) {
    const doctorName = `Dr. ${this.doctor!.firstName} ${this.doctor!.lastName}`;
    const specialty = this.doctor!.specialties[0].name;
    const text = `¡Descubre a un excelente especialista en ${specialty}! Te recomiendo al ${doctorName}. Su experiencia y atención son excepcionales. Agenda tu cita fácilmente a través de Mediverse y cuida tu salud con lo mejor.`;
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + this.shareUrl)}`;
        break;
      case 'email':
        const subject = `Te recomiendo a un excelente especialista en ${specialty}: ${doctorName}`;
        url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text + '\n\nMás información y agenda tu cita: ' + this.shareUrl)}`;
        break;
    }

    window.open(url, '_blank');
  }

  copyShareUrl(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
    // You can add a toast notification here to inform the user that the URL has been copied
  }
}