import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { EventsCalendarComponent } from "src/app/events/components/events-calendar.component";
import { EventsTableComponent } from "src/app/events/components/events-table/events-table.component";
import { EventsService } from "src/app/events/events.config";

@Component({
  selector: '[eventsCatalog]',
  templateUrl: './events-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    EventsTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module, EventsCalendarComponent,
   ],
})
export class EventsCatalogComponent
  extends BaseCatalog<Event, EventParams, EventFiltersForm, EventsService>
  implements OnDestroy, CatalogInputSignals<Event, EventParams>
{
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();

  calendarView = model.required<CalendarView>();
  filtersCollapsed = model.required<boolean>();

  constructor() {
    super(EventsService, EventFiltersForm);

    effect(() => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active())
      ;

      this.service.createEntry(this.key(), this.params(), this.mode());

      this.service.cache$.subscribe({
        next: cache => {
          this.service.loadPagedList(this.key(), this.params()).subscribe();
        }
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
