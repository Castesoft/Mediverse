import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject, model, input, ModelSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { Subscription } from "rxjs";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { CatalogMode, View } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { eventCells } from "src/app/_models/events/eventConstants";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { UtilsService } from "src/app/_services/utils.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { EventsService } from "src/app/events/events.config";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_events', },
  selector: 'table[eventsTable]',
  standalone: true,
  templateUrl: './events-table.component.html',
  imports: [FontAwesomeModule, FormsModule, RouterModule, BsDropdownModule, CommonModule,
    MaterialModule, CdkModule,
    TooltipModule
  ],
})
export class EventsTableComponent
  extends BaseTable<Event, EventParams, EventFiltersForm, EventsService>
  implements OnInit, OnDestroy, TableInputSignals<Event, EventParams>
{
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  data: ModelSignal<Event[]> = model.required();

  utils = inject(UtilsService);

  showHeaders = input<boolean>(true);
  location = input<'events-catalog' | 'user-detail'>('events-catalog');

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;

  subscriptions: Subscription[] = [];

  cuid: string = createId();

  constructor() {
    super(EventsService, Event, { tableCells: eventCells, });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getContrastColor(hexColor: string): string {
    // Remove the hash if it's there
    hexColor = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
