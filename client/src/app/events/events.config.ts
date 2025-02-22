import { Component, inject, Injectable, model, ModelSignal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { eventColumns, eventDictionary } from "src/app/_models/events/eventConstants";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { EventWindowComponent } from 'src/app/events/components/event-detail/event-window.component';
import { EventFormComponent } from 'src/app/events/components/event-form.component';
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { EventMonthDayCell } from "src/app/_models/event-month-day-cell/eventMonthDayCell";
import { HttpParams } from "@angular/common/http";
import { transform, transformToHttpParams } from "src/app/_models/base/paramUtils";

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

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ServiceHelper<Event, EventParams, FormGroup2<EventParams>> {
  private eventMonthDayCellsSubject: BehaviorSubject<EventMonthDayCell[]> = new BehaviorSubject<EventMonthDayCell[]>([]);
  public eventMonthDayCells$: Observable<EventMonthDayCell[]> = this.eventMonthDayCellsSubject.asObservable();


  constructor() {
    super(EventParams, 'events', eventDictionary, eventColumns, EventDetailModalComponent);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      EventsCatalogModalComponent,
      CatalogDialog<Event, EventParams>
    >(EventsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new EventParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: true,
      panelClass: [ "window" ]
    });
  };

  createRaw(model: any) {
    console.log("posting event with model", model);
    return this.http.post<Event>(`${this.baseUrl}`, model);
  }

  /**
   * Loads partial month data: each day cell has up to N events, plus a total count.
   */
  getMonthViewPartial(key: string | null, params: EventParams): Observable<EventMonthDayCell[]> {
    if (key === null) throw new Error("Key cannot be null");

    const payload: HttpParams = transformToHttpParams(transform(params));

    console.log('params', params);

    return this.http.get<EventMonthDayCell[]>(`${this.baseUrl}month-partial`, { params: payload }).pipe(
      tap((response) => {
        this.eventMonthDayCellsSubject.next(response);
      }));
  }

  updateEvolution(id: number, evolution: string): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}${id}/evolution`, { content: evolution }).pipe(
      tap(() => {
        this.matSnackBar.open('Evolución actualizada', 'Cerrar', { duration: 5000 });
      })
    )
  }

  updateNextSteps(id: number, nextSteps: string): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}${id}/next-steps`, { content: nextSteps }).pipe(
      tap(() => {
        this.matSnackBar.open('Próximos pasos actualizados', 'Cerrar', { duration: 5000 });
      })
    )
  }
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
