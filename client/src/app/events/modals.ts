import { CdkDrag } from "@angular/cdk/drag-drop";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { Event } from "../_models/events/event";
import { CatalogModal, DetailModal, FilterModal } from "src/app/_shared/table/table.module";
import { EventDetailComponent } from "src/app/events/components/event-detail/event-detail.component";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog/events-catalog.component";
import { EventsFilterFormComponent } from "src/app/events/components/events-filter-form.component";

@Component({
  standalone: true,
  selector: 'event-detail-modal',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }
      <mat-dialog-content>
        <div eventDetail [id]="data.id" [use]="data.use" [view]="data.view" [key]="data.key" [item]="data.item"></div>
      </mat-dialog-content>
    </div>
  `,
  imports: [EventDetailComponent, MatDialogTitle, MatDialogContent, CdkDrag ],
})
export class EventDetailModalComponent {
  data = inject<DetailModal<Event>>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'events-filter-modal',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
    @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }
      <mat-dialog-content>
        <div eventsFilterForm [formId]="data.formId" [key]="data.key"></div>
      </mat-dialog-content>
    </div>
  `,
  standalone: true,
  imports: [EventsFilterFormComponent, MatDialogTitle, MatDialogContent, CdkDrag, ],
})
export class EventsFilterModalComponent {
  data = inject<FilterModal>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'events-catalog-modal',
  template: `
      <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }

        <mat-dialog-content>
          <div eventsCatalog [mode]="data.mode" [key]="data.key" [view]="data.view" [role]="data.role"></div>
        </mat-dialog-content>
      </div>
  `,
  standalone: true,
  imports: [EventsCatalogComponent, MatDialogTitle, MatDialogContent, CdkDrag, ],
})
export class EventsCatalogModalComponent {
  data = inject<CatalogModal>(MAT_DIALOG_DATA);
}
