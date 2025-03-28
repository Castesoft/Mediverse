import { Injectable } from "@angular/core";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import Event from "src/app/_models/events/event";
import { EventParams } from "src/app/_models/events/eventParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { EventMonthDayCell } from "src/app/_models/event-month-day-cell/eventMonthDayCell";
import { eventColumns, eventDictionary } from "src/app/_models/events/eventConstants";
import { CatalogMode, View } from "src/app/_models/base/types";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import { EventSummary } from "src/app/_models/events/eventSummary/eventSummary";
import { HttpParams } from "@angular/common/http";
import { transform, transformToHttpParams } from "src/app/_models/base/paramUtils";
import { EventDetailModalComponent, EventsCatalogModalComponent } from "src/app/events/events.config";

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

  getSummaryByIdFromCalendarData(id: number): EventSummary | null {
    return this.eventMonthDayCellsSubject.value.flatMap((cell) => cell.events).find((event) => event?.id === id) || null;
  }

  /**
   * Loads partial month data: each day cell has up to N events, plus a total count.
   */
  getMonthViewPartial(key: string | null, params: EventParams): Observable<EventMonthDayCell[]> {
    if (key === null) throw new Error("Key cannot be null");
    this.eventMonthDayCellsSubject.next([]);

    const payload: HttpParams = transformToHttpParams(transform(params));

    return this.http.get<EventMonthDayCell[]>(`${this.baseUrl}month-partial`, { params: payload }).pipe(
      tap((response) => {
        this.eventMonthDayCellsSubject.next(response);
      }));
  }

  updateEvolution(id: number, evolution: string): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}${id}/evolution`, { content: evolution }).pipe(
      tap(() => {
        this.toastr.success('Evolución actualizada');
      })
    )
  }

  updateNextSteps(id: number, nextSteps: string): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}${id}/next-steps`, { content: nextSteps }).pipe(
      tap(() => {
        this.toastr.success('Próximos pasos actualizados');
      })
    )
  }
}
