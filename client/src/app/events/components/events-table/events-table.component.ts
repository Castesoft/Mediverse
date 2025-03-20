import { CommonModule } from "@angular/common";
import { Component, effect, input, InputSignal, model, ModelSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { CatalogMode, View } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { eventCells, EventsTableDisplayRole } from "src/app/_models/events/eventConstants";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { UserTableCellComponent } from "src/app/users/components/user-table-cell.component";
import { TimePeriodCellComponent } from "src/app/_shared/template/components/tables/cells/time-period-cell.component";
import { Column } from "src/app/_models/base/column";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import {
  AddressTableCellComponent
} from "src/app/_shared/template/components/tables/cells/address-table-cell.component";
import { EventsService } from "src/app/events/events.service";

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
    TableMenuComponent,
    AddressTableCellComponent,
  ],
})
export class EventsTableComponent extends BaseTable<Event, EventParams, EventFiltersForm, EventsService> implements TableInputSignals<Event, EventParams> {
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  data: ModelSignal<Event[]> = model.required();

  showHeaders: InputSignal<boolean> = input<boolean>(true);
  displayRole: InputSignal<EventsTableDisplayRole> = input(EventsTableDisplayRole.PATIENT as EventsTableDisplayRole);

  columns: Column[] = [];

  constructor() {
    super(EventsService, Event, { tableCells: eventCells });

    effect((): void => {
      if (this.columns.length === 0) {
        this.columns = [ ...this.service.columns ];
      }

      if (this.displayRole() === 'doctor') {
        this.service.columns = this.columns.filter((column: Column) => column.name !== 'patient');
      } else {
        this.service.columns = this.columns.filter((column: Column) => column.name !== 'doctor');
      }
    });
  }
}
