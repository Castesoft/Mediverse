import { Component, effect, inject, model, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { EventsService } from "src/app/events/events.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeEventsCatalogRoute]',
  // template: ``,
  templateUrl: './home-events-catalog-route.component.html',
  standalone: false,
})
export class HomeEventsCatalogRouteComponent
  extends BaseRouteCatalog<Event, EventParams, EventFiltersForm, EventsService>
{
  route = inject(ActivatedRoute);

  calendarView = signal<CalendarView>('calendar');

  constructor() {
    super(EventsService, 'events');

    const state = this.route.snapshot.queryParams['mode'];

    if (state !== null && state === 'calendar') {
      this.calendarView.set('calendar');
    } else if(state === 'table') {
      this.calendarView.set('table');
    }

    effect(() => {
      if (this.calendarView() === 'calendar') {
        this.router.navigate([], { queryParams: { mode: 'calendar' }, queryParamsHandling: 'merge' });
      } else if (this.calendarView() === 'table') {
        this.router.navigate([], { queryParams: { mode: 'table' }, queryParamsHandling: 'merge' });
      }
    });

    this.key.set(`${this.router.url}#events-catalog`);

    this.params.set(new EventParams(this.key(), { role: 'Doctor', }));
  }

}
