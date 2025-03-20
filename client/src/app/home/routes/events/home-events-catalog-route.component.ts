import { Component, effect, inject, OnDestroy, signal, WritableSignal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { PaddingService } from 'src/app/_services/padding.service';
import { ClinicsService } from 'src/app/clinics/clinics.config';
import { NursesService } from 'src/app/nurses/nurses.config';
import { PatientsService } from 'src/app/patients/patients.config';
import { ServicesService } from 'src/app/services/services.config';
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { EventsService } from "src/app/events/events.service";

@Component({
  selector: 'div[homeEventsCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div eventsCatalog
           [(item)]="item"
           [(isCompact)]="compact.isCompact"
           [(key)]="key"
           [(mode)]="mode"
           [(params)]="params"
           [(view)]="view"
           [(calendarView)]="calendarView"
           [(filtersCollapsed)]="filtersCollapsed"
      ></div>
    </div>
  `,
  standalone: false,
})
export class HomeEventsCatalogRouteComponent extends BaseRouteCatalog<Event, EventParams, EventFiltersForm, EventsService> implements OnDestroy {
  private accountService: AccountService = inject(AccountService);

  route: ActivatedRoute = inject(ActivatedRoute);
  padding: PaddingService = inject(PaddingService);

  patients: PatientsService = inject(PatientsService);
  services: ServicesService = inject(ServicesService);
  clinics: ClinicsService = inject(ClinicsService);
  nurses: NursesService = inject(NursesService);

  account: Account | null = null;

  calendarView: WritableSignal<CalendarView> = signal<CalendarView>('calendar');
  filtersCollapsed: WritableSignal<boolean> = signal(false);

  form: EventFiltersForm = new EventFiltersForm();

  fromWrapper: WritableSignal<boolean> = signal(false);
  calendarViewQueryParam: CalendarView | null = null;

  constructor() {
    super(EventsService, 'events');
    this.padding.withPadding.set(true);

    effect(() => {
      if (this.accountService.current()) {
        if (this.calendarViewQueryParam !== null) {
          this.calendarView.set(this.calendarViewQueryParam);
        }

        this.account = this.accountService.current();

        const paramsToSet = new EventParams(this.key(), {
          isCalendarView: this.calendarView() == 'calendar',
          fromSection: SiteSection.HOME,
          userId: this.account?.id,
        });

        if (!paramsToSet.month || !paramsToSet.year) {
          paramsToSet.month = new Date().getMonth() + 1;
          paramsToSet.year = new Date().getFullYear();
        }

        console.log('setting new params with month and year', paramsToSet.month, paramsToSet.year);

        this.params.set(paramsToSet);
      }
    });

    this.setInitialTabsFromParams();
  }

  private setInitialTabsFromParams(): void {
    this.calendarViewQueryParam = this.route.snapshot.queryParams['view'] || this.calendarView();
  }

  ngOnDestroy(): void {
    this.padding.withPadding.set(true);
  }
}
