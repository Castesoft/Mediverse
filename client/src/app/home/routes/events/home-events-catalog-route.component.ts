import { Component, inject, OnDestroy, signal } from "@angular/core";
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
  selector: 'div[homeEventsCatalogRoute]',
  templateUrl: './home-events-catalog-route.component.html',
  standalone: false,
})
export class HomeEventsCatalogRouteComponent
  extends BaseRouteCatalog<Event, EventParams, EventFiltersForm, EventsService>
  implements OnDestroy {
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
    this.padding.withPadding.set(false);
  }

  ngOnDestroy(): void {
    this.padding.withPadding.set(true);
  }
}
