import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AvailableDay } from 'src/app/_models/availableDay';
import { DoctorResult } from 'src/app/_models/doctors/doctorResults/doctorResult';
import { SearchService } from 'src/app/_services/search.service';
import { ShareModalComponent } from 'src/app/landing/components/doctor-profile/share-modal/share-modal.component';
import { DoctorGeneralTabComponent } from 'src/app/search/tabs/doctor-general-tab.component';
import { DoctorReviewsTabComponent } from 'src/app/search/tabs/doctor-reviews-tab.component';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [
    ProfilePictureComponent,
    DoctorGeneralTabComponent,
    DoctorReviewsTabComponent,
  ],
  templateUrl: './doctor-profile.component.html'
})
export class DoctorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  service = inject(SearchService);
  private bsModalService = inject(BsModalService);

  doctor: DoctorResult | null = null;
  activeTab = 'general';
  isScheduling = false;
  selectedSchedule = signal<AvailableDay | null>(null);

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
      this.service.getDoctorById(+doctorId).subscribe(
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

  selectSchedule(schedule: AvailableDay) {
    this.isScheduling = true;
    this.selectedSchedule.set(schedule);
  }

  onCloseDoctorSchedule(event: boolean) {
    this.isScheduling = false;
    const selectedSchedule = this.selectedSchedule();
    if (event && selectedSchedule !== null) {
      setTimeout(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { day: selectedSchedule.dayNumber },
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
    const text = `¡Descubre a un excelente especialista en ${specialty}! Te recomiendo al ${doctorName}. Su experiencia y atención son excepcionales. Agenda tu cita fácilmente a través de DocHub y cuida tu salud con lo mejor.`;
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

  protected readonly PhotoSize = PhotoSize;
}
