import { CommonModule } from "@angular/common";
import { Component, model, ModelSignal, OnDestroy, OnInit } from "@angular/core";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { View, CatalogMode } from "src/app/_models/base/types";
import { Event } from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { BaseCatalog } from "src/app/_models/forms/extensions/baseFormComponent";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { LayoutModule } from "src/app/_shared/layout.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { EventsTableComponent } from "src/app/events/components/events-table.component";
import { EventsService } from "src/app/events/events.config";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[eventsCatalog]',
  templateUrl: './events-catalog.component.html',
  standalone: true,
  imports: [
    CommonModule, Forms2Module, TableModule, LayoutModule, EventsTableComponent,
  ],
})
export class EventsCatalogComponent
  extends BaseCatalog<Event, EventParams, EventFiltersForm, EventsService>
  implements OnInit, OnDestroy, CatalogInputSignals<Event, EventParams>
{
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();

  constructor() {
    super(EventsService, EventFiltersForm);
  }

  ngOnInit(): void {
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }

}
