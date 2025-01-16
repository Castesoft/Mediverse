import { Component, effect, HostBinding, inject, signal } from '@angular/core';
import { createId } from '@paralleldrive/cuid2';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { EventParams } from 'src/app/_models/events/eventParams';
import { CalendarView } from 'src/app/_models/events/eventTypes';
import { Service } from 'src/app/_models/services/service';
import { ServiceTabs } from 'src/app/_models/services/serviceTypes';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: 'div[homeServiceDetailRoute]',
  // template: `
  //   <div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  // `,
  templateUrl: './home-service-detail-route.component.html',
  standalone: false,
})
export class HomeServiceDetailRouteComponent
  extends BaseRouteDetail<Service>

{
  compact = inject(CompactTableService);

  tab = signal<ServiceTabs>('general');
  eventItem = signal(null);
  eventView = signal<View>('inline');
  eventKey = signal<string>(`${this.router.url}#event-detail`);
  eventMode = signal<CatalogMode>('readonly');
  eventParams = signal<EventParams>(new EventParams(createId()));
  eventCalendarView = signal<CalendarView>('table');
  eventFiltersCollapsed = signal(true);

  hostClass = '';

  constructor() {
    super('services', FormUse.DETAIL);

    const tab: ServiceTabs | undefined = this.route.snapshot.queryParams['tab'];

    if (tab !== undefined) {
      this.tab.set(tab);
    }

    this.key.set(`${this.router.url}#service-detail`);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);

            this.eventParams.update(oldValues => {
              return new EventParams(this.key(), {
                ...oldValues,
                serviceId: this.id(),
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
