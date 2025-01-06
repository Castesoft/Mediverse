import { Component, effect, inject, OnDestroy, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { PaddingService } from 'src/app/_services/padding.service';
import { ClinicsService } from 'src/app/clinics/clinics.config';
import { EventsService } from "src/app/events/events.config";
import { NursesService } from 'src/app/nurses/nurses.config';
import { PatientsService } from 'src/app/patients/patients.config';
import { ServicesService } from 'src/app/services/services.config';

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeEventsCatalogRoute]',
  templateUrl: './home-events-catalog-route.component.html',
  standalone: false,
})
export class HomeEventsCatalogRouteComponent
  extends BaseRouteCatalog<Event, EventParams, EventFiltersForm, EventsService>
  implements OnDestroy
{
  route = inject(ActivatedRoute);
  padding = inject(PaddingService);

  services = inject(ServicesService);
  clinics = inject(ClinicsService);
  nurses = inject(NursesService);
  patients = inject(PatientsService);

  calendarView = signal<CalendarView>('calendar');
  filtersCollapsed = signal(false);

  form = new EventFiltersForm();

  fromWrapper = signal(false);

  constructor() {
    super(EventsService, 'events');

    this.services.getOptions().subscribe();
    this.clinics.getOptions().subscribe();
    this.nurses.getOptions().subscribe();
    this.patients.getOptions().subscribe();

    this.padding.withPadding.update(() => false);

    const state = this.route.snapshot.queryParams['mode'];
    const filters = this.route.snapshot.queryParams['filters'];

    if (state !== null && state === 'calendar') {
      this.calendarView.set('calendar');
    } else if(state === 'table') {
      this.calendarView.set('table');
    }

    if (filters && filters === 'collapsed') {
      this.filtersCollapsed.set(true);
    } else {
      this.filtersCollapsed.set(false);
    }

    effect(() => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active())
        .setPatientOptions(this.patients.options())
        .setServiceOptions(this.services.options())
        .setNurseOptions(this.nurses.options())
        .setClinicOptions(this.clinics.options())
      ;

      if (this.calendarView() === 'calendar') {
        this.router.navigate([], { queryParams: { mode: 'calendar' }, queryParamsHandling: 'merge' });
      } else if (this.calendarView() === 'table') {
        this.router.navigate([], { queryParams: { mode: 'table' }, queryParamsHandling: 'merge' });
      }

      if (this.filtersCollapsed()) {
        this.router.navigate([], { queryParams: { filters: 'collapsed' }, queryParamsHandling: 'merge' });
      } else {
        this.router.navigate([], { queryParams: { filters: 'expanded' }, queryParamsHandling: 'merge' });
      }

      if (this.filtersCollapsed()) {

      }

    });

    this.key.set(`${this.router.url}#events-catalog`);

    this.params.set(new EventParams(this.key(), { role: 'Doctor', }));
  }

  ngOnDestroy(): void {
    this.padding.withPadding.update(() => true);
  }

}
