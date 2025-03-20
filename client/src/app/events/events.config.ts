import { Component, inject, model, ModelSignal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { View } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
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

@Component({
  selector: 'event-detail-modal',
  template: `
    @defer {
      <div class="card">
        @if (data.title) {
          <div class="card-header">
            <div class="card-title">
              <h3>{{ data.title }}</h3>
            </div>
          </div>
        }

        <div class="card-body pt-0">
          <div
            eventDetail
            [(use)]="data.use"
            [(view)]="data.view"
            [(key)]="data.key"
            [(item)]="data.item"
            [(title)]="data.title"
          ></div>
          <div class="d-flex w-100 justify-content-between mt-6">
            <button class="btn btn-light-secondary" mat-dialog-close>Cerrar</button>
            <button class="btn btn-primary" (click)="navigateToDetail(data.item)">Ver Detalle</button>
          </div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [ EventDetailComponent, ModalWrapperModule, MaterialModule, CdkModule ],
})
export class EventDetailModalComponent {
  private readonly dialogRef: MatDialogRef<EventDetailModalComponent> = inject(MatDialogRef);
  private readonly eventsService: EventsService = inject(EventsService);

  readonly data: DetailDialog<Event> = inject(MAT_DIALOG_DATA);

  navigateToDetail(item: Event | null): void {
    const eventId: number | null = item?.id || null;
    if (!eventId) {
      console.error('No se puede navegar a un evento sin ID');
      return;
    }

    this.dialogRef.close();
    this.eventsService.clickLink(item, null, FormUse.DETAIL, 'page');
  }
}
