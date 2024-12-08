import { Component } from "@angular/core";
import { Event } from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { BaseRouteCatalog } from "src/app/_models/forms/extensions/baseFormComponent";
import { EventsService } from "src/app/events/events.config";

@Component({
  selector: 'home-events-catalog-route',
  // template: ``,
  templateUrl: './home-events-catalog-route.component.html',
  standalone: false,
})
export class HomeEventsCatalogRouteComponent
  extends BaseRouteCatalog<Event, EventParams, EventFiltersForm, EventsService>
{

  constructor() {
    super(EventsService, 'events');
  }

}
