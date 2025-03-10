import { Component, effect, Host, HostBinding, inject, input, model, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorResult } from 'src/app/_models/doctors/doctorResults/doctorResult';
import { Search } from 'src/app/_models/search/search';
import { SearchService } from 'src/app/_services/search.service';
import { DoctorGeneralTabComponent } from 'src/app/search/tabs/doctor-general-tab.component';
import { DoctorReviewsTabComponent } from 'src/app/search/tabs/doctor-reviews-tab.component';
import { DoctorScheduleTabComponent } from 'src/app/search/tabs/doctor-schedule-tab.component';
import { PhotoSize } from 'src/app/_models/photos/photoTypes';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';

@Component({
  selector: 'div[doctorDetailWindow]',
  standalone: true,
  imports: [ DoctorGeneralTabComponent, DoctorScheduleTabComponent, DoctorReviewsTabComponent, FaIconComponent ],
  templateUrl: './doctor-detail-window.component.html',
  styleUrl: './doctor-detail-window.component.scss'
})
export class DoctorDetailWindowComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly icons: IconsService = inject(IconsService);
  readonly service = inject(SearchService);
  readonly utilsService = inject(UtilsService);
  readonly query = inject(MobileQueryService);

  startingTab = input<string>();
  onEventCreated = output();
  scheduleWindowOpen = model.required<boolean>();
  selectedSchedule = model.required<AvailableDay | null>();
  selectedTime = model.required<AvailableTime | null>();

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  class = '';

  constructor() {

    effect(() => {

      if (this.query.isMobile() === true) {
        this.class = 'mobile-view';
      } else if (this.query.isMobile() === false) {
        this.class = 'desktop-view';
      }

      let selected = this.service.selected();
      if (selected !== null && this.service.search().dayNumber !== null && this.service.search().scheduleOption !== null) {
        selected = new DoctorResult({ ...selected });
        const variable: AvailableDay | null = selected.getAvailableDayByDayNumber(this.service.search().dayNumber!);
        this.selectedSchedule.set(variable);

        if (this.selectedSchedule() !== null) {
          this.scheduleWindowOpen.set(true);
        } else if (this.selectedSchedule() === null && this.selectedTime() === null) {
          this.scheduleWindowOpen.set(false);
        }
      } else {
        // this.scheduleWindowOpen.set(false);
      }
    });
  }

  selectTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });

    this.service.search.set(new Search(this.service.search().key, {
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
      this.router.navigate([ '/doctor', this.service.selected()!.id ]);
    }
  }

  protected readonly PhotoSize = PhotoSize;
}
