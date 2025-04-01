import { Component, inject, model, ModelSignal } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import { View } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { EventWindowComponent } from 'src/app/events/components/event-detail/event-window.component';
import { EventFormComponent } from 'src/app/events/components/event-form.component';
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { EventsService } from "src/app/events/events.service";

@Component({
  selector: 'events-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          eventsCatalog
          [(mode)]="data.mode"
          [(key)]="data.key"
          [(view)]="data.view"
          [(isCompact)]="data.isCompact"
          [(item)]="data.item"
          [(params)]="data.params"
          [(calendarView)]="data.calendarView"
          [(filtersCollapsed)]="data.filtersCollapsed"
        ></div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cerrar</button>
      </mat-dialog-actions>
    }
  `,
  standalone: true,
  imports: [ EventsCatalogComponent, MaterialModule, CdkModule, ],
})
export class EventsCatalogModalComponent {
  data = inject<CatalogDialog<Event, EventParams> & {
    calendarView: CalendarView;
    filtersCollapsed: boolean;
  }>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'div[eventDetail]',
  template: `
    @if (use() === 'create' || use() === 'edit') {
      <div eventForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
    }
    @if (use() === 'detail') {
      <div eventWindow [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view" [(title)]="title"></div>
    }
  `,
  standalone: true,
  imports: [ EventFormComponent, ControlsModule, Forms2Module, EventWindowComponent, ],
})
export class EventDetailComponent extends BaseDetail<Event, EventParams, EventFiltersForm, EventsService> implements DetailInputSignals<Event> {
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(EventsService);
  }
}
