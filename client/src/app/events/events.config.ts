import { CommonModule } from "@angular/common";
import { Component, inject, Injectable, ModelSignal, model, effect } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { Observable, tap } from 'rxjs';
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Event } from "src/app/_models/events/event";
import { eventDictionary, eventColumns } from "src/app/_models/events/eventConstants";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventForm } from "src/app/_models/events/eventForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { FormInputSignals, DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";

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
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [EventsCatalogComponent, MaterialModule, CdkModule,],
})
export class EventsCatalogModalComponent {
  data = inject<CatalogDialog<Event, EventParams> & { calendarView: CalendarView; }>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ServiceHelper<Event, EventParams, FormGroup2<EventParams>> {
  constructor() {
    super(EventParams, 'events', eventDictionary, eventColumns);
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
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };

  clickLink(
    item: Event | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      EventDetailModalComponent,
      DetailDialog<Event>
    >(EventDetailModalComponent, {
      data: {
        item: item,
        key: key,
        use: use,
        view: 'modal',
        title: this.getFormHeaderText(use, item),
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ 'window' ]
    });

  } else {
    switch (use) {
      case 'create':
        this.router.navigate([this.dictionary.createRoute]);
        break;
      case 'edit':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}/editar`]);
        break;
      case 'detail':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  }

  createInSearch(model: any): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}search`, model).pipe(
      tap(response => {

      })
    );
  }
}

@Component({
  selector: "[eventForm]",
  // template: ``,
  templateUrl: './event-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class EventFormComponent
  extends BaseForm<
    Event, EventParams, EventFiltersForm, EventForm, EventsService
  >
  implements FormInputSignals<Event> {
  item: ModelSignal<Event | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(EventsService, EventForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }
}

@Component({
  selector: 'div[eventDetail]',
  template: `
  <div container3 [type]="'inline'">
    <!-- <div detailHeader [(use)]="use" [(view)]="view" [(dictionary)]="service.dictionary" [id]="item() !== null ? item()!.id : null" (onDelete)="service.delete$(item()!)"></div> -->
  </div>
  <div eventForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [EventFormComponent, ControlsModule, Forms2Module,],
})
export class EventDetailComponent
  extends BaseDetail<Event, EventParams, EventFiltersForm, EventsService>
  implements DetailInputSignals<Event>
{
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
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      eventDetail
      [(use)]="data.use"
      [(view)]="data.view"
      [(key)]="data.key"
      [(item)]="data.item"
      [(title)]="data.title"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [EventDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class EventDetailModalComponent {
  data = inject<DetailDialog<Event>>(MAT_DIALOG_DATA);
}
