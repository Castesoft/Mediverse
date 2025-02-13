import { Component, effect, HostBinding, inject, signal } from '@angular/core';
import { createId } from '@paralleldrive/cuid2';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { View, CatalogMode } from 'src/app/_models/base/types';
import Clinic from 'src/app/_models/clinics/clinic';
import { ClinicTabs } from 'src/app/_models/clinics/clinicTypes';
import { EventParams } from 'src/app/_models/events/eventParams';
import { CalendarView } from 'src/app/_models/events/eventTypes';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { FormUse } from "src/app/_models/forms/formTypes";
import { ClinicsService } from 'src/app/clinics/clinics.config';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';

@Component({
  host: { class: '' },
  selector: 'div[homeClinicDetailRoute]',
  // template: `
  //   <div clinicDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  // `,
  templateUrl: './home-clinic-detail-route.component.html',
  standalone: false,
})
export class HomeClinicDetailRouteComponent
  extends BaseRouteDetail<Clinic>

{
  readonly service = inject(ClinicsService);

  compact = inject(CompactTableService);

  tab = signal<ClinicTabs>('general');
  eventItem = signal(null);
  eventView = signal<View>('inline');
  eventKey = signal<string>(`${this.router.url}#event-detail`);
  eventMode = signal<CatalogMode>('readonly');
  eventParams = signal<EventParams>(new EventParams(createId()));
  eventCalendarView = signal<CalendarView>('table');
  eventFiltersCollapsed = signal(true);

  nurseItem = signal(null);
  nurseView = signal<View>('inline');
  nurseKey = signal<string>(`${this.router.url}#nurse-detail`);
  nurseMode = signal<CatalogMode>('readonly');
  nurseParams = signal<NurseParams>(new NurseParams(createId()));
  nurseCalendarView = signal<CalendarView>('table');
  nurseFiltersCollapsed = signal(true);

  hostClass = '';

  constructor() {
    super('clinics', FormUse.DETAIL);

    const tab: ClinicTabs | undefined = this.route.snapshot.queryParams['tab'];

    if (tab !== undefined) {
      this.tab.set(tab);
    }

    this.key.set(`${this.router.url}#clinic-detail`);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);

            this.eventParams.update(oldValues => {
              return new EventParams(this.key(), {
                ...oldValues,
                clinicId: this.id(),
              });
            });

            this.nurseParams.update(oldValues => {
              return new NurseParams(this.key(), {
                ...oldValues,
                clinicId: this.id(),
              });
            });
          }
        },
      });
      
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }

      switch (this.use()) {
        case 'detail':
          this.hostClass = 'd-flex flex-column flex-xl-row';
          break;
      }

      this.router.navigate([], { queryParams: {
        tab: this.tab(),
      }, queryParamsHandling: 'merge' });
    });
  }

  @HostBinding('class') get class() {
    return this.hostClass;
  }

}
