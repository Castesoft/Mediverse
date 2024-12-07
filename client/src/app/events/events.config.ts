import { CommonModule } from "@angular/common";
import { Component, effect, inject, Injectable, model, ModelSignal, NgModule } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Event } from "src/app/_models/events/event";
import { eventColumns, eventDictionary } from "src/app/_models/events/eventConstants";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { BaseDetail, BaseForm, BaseRouteCatalog, BaseRouteDetail, createItemResolver } from "src/app/_models/forms/extensions/baseFormComponent";
import { DetailInputSignals, FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { CatalogModalType, DetailModalType } from "src/app/_shared/table/table.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

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
  data = inject<CatalogModalType<Event, EventParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ServiceHelper<Event, EventParams, EventFiltersForm> {
  constructor() {
    super(EventParams, 'events', eventDictionary, eventColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      EventsCatalogModalComponent,
      CatalogModalType<Event, EventParams>
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
      DetailModalType<Event>
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
    <div detailHeader [(use)]="use" [(view)]="view" [(dictionary)]="service.dictionary" [id]="item() !== null ? item()!.id : null" (onDelete)="service.delete$(item()!)"></div>
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
  data = inject<DetailModalType<Event>>(MAT_DIALOG_DATA);
}


@Component({
  selector: 'events-route',
  standalone: false,
  template: `
  <router-outlet></router-outlet>
  `,
})
export class EventsComponent {}

@Component({
  selector: 'events-catalog-route',
  template: `
  <div
    eventsCatalog
    [(mode)]="mode"
    [(key)]="key"
    [(view)]="view"
    [(isCompact)]="compact.isCompact"
    [(item)]="item"
    [(params)]="params"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, EventsCatalogComponent, ],
})
export class CatalogComponent extends BaseRouteCatalog<Event, EventParams, EventFiltersForm, EventsService> {
  constructor() {
    super(EventsService, 'events');

    effect(() => {
      console.log('key', this.key());
    });
  }
}

@Component({
  selector: 'event-detail-route',
  template: `<div eventDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [RouterModule, EventDetailComponent,],
})
export class DetailComponent extends BaseRouteDetail<Event> {
  constructor() {
    super('events', 'detail');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'event-edit-route',
  template: `
  <nav breadcrumbs>
    <li sectionItem [section]="'admin'"></li>
      <li sectionItem [section]="'maintenance'"></li>
      <li sectionItem [(section)]="section"></li>
      <li active [(label)]="label" [(item)]="item"></li>
    </nav>
    <div eventDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  standalone: true,
  imports: [EventDetailComponent, RouterModule,],
})
export class EditComponent extends BaseRouteDetail<Event> {
  constructor() {
    super('events', 'edit');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'event-new-route',
  template: `<div eventDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [EventDetailComponent, RouterModule,],
})
export class NewComponent extends BaseRouteDetail<Event> {
  constructor() {
    super('events', 'create');

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ganaderías', data: { breadcrumb: 'Ganaderías', },
      component: EventsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ganaderías', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nueva ganadería', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: createItemResolver(EventsService) },
        },
        {
          path: ':id/editar', data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: createItemResolver(EventsService) },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [ CommonModule, EventsRoutingModule, ]
})
export class EventsModule { }

