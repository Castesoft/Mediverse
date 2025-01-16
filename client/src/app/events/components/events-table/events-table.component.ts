import { CommonModule } from "@angular/common";
import { Component, OnInit, ModelSignal, model, OnDestroy, effect, input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { eventCells } from "src/app/_models/events/eventConstants";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { EventsService } from "src/app/events/events.config";
import { UserTableCellComponent } from "src/app/users/components/user-table-cell.component";
import { TimePeriodCellComponent } from "src/app/_shared/template/components/tables/cells/time-period-cell.component";
import { Column } from "src/app/_models/base/column";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[eventsTable]',
  templateUrl: './events-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    UserTableCellComponent,
    TimePeriodCellComponent,
  ],
})
export class EventsTableComponent extends BaseTable<Event, EventParams, EventFiltersForm, EventsService> implements OnDestroy, TableInputSignals<Event, EventParams> {
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  data: ModelSignal<Event[]> = model.required();

  showHeaders = input<boolean>(true);
  showDoctorColumn = input<boolean>(false);

  columns: Column[] = [];

  constructor() {
    super(EventsService, Event, { tableCells: eventCells, });

    effect((): void => {
      if (this.columns.length === 0) {
        this.columns = this.service.columns;
      }

      if (this.showDoctorColumn()) {
        this.service.columns = this.columns;
      } else {
        this.service.columns = this.columns.filter(column => column.name !== 'doctor');
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
