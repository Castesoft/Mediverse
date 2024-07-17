import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ResolveFn, Router, RouterModule, Routes } from "@angular/router";
import {CatalogMode, FormUse, Role, Sections, View} from "src/app/_models/types";
import {CompactTableService} from "src/app/_services/compact-table.service";
import {EventsService} from "src/app/_services/events.service";
import {Event} from "src/app/_models/event";
import {GuidService} from "src/app/_services/guid.service";
import {LayoutModule} from "src/app/_shared/layout.module";
import {EventsCalendarComponent} from "src/app/events/components/events-calendar.component";
import {EventsCatalogComponent} from "src/app/events/components/events-catalog.component";
import {EventDetailComponent, EventEditComponent, EventNewComponent} from "src/app/events/views";

@Component({
  selector: 'events-route',
  template: `<router-outlet></router-outlet>`,
})
export class EventsComponent implements OnInit {
    ngOnInit(): void {

    }
}

@Component({
  selector: 'events-catalog-route',
  template: `
  <div card>
    <div
      eventsCalendar
      [role]="role"
      [mode]="mode"
      [key]="key"
      [view]="view"
    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, EventsCatalogComponent, EventsCalendarComponent, LayoutModule,],
})
export class CatalogComponent implements OnInit {
  service = inject(EventsService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  section: Sections = 'events';
  role: Role = 'Patient';
  label: string;

  constructor() {
    this.label = this.service.naming!.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'event-detail-route',
  template: `
    @if (id && item) {
      <div
        eventDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"
      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, EventDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Event;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  section: Sections = 'events';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.patient?.fullName;
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
@Component({
  selector: 'event-edit-route',
  template: `
      @if (id && item) {
        <div
          eventEditView
          [id]="id"
          [use]="use"
          [view]="view"
          [key]="key"
          [item]="item"
          [role]="role"
        ></div>
      }
  `,
  standalone: true,
  imports: [EventEditComponent, RouterModule, LayoutModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: Event;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
  key = undefined;
  section: Sections = 'events';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.patient?.fullName;
      },
    });
  }
}

@Component({
  selector: 'event-new-route',
  template: `<div eventNewView [use]="use" [view]="view" [role]="role"
  ></div>`,
  standalone: true,
  imports: [EventNewComponent, RouterModule, LayoutModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  role: Role = 'Patient';
}

export const itemResolver: ResolveFn<Event | null> = (route, state) => {
  const service = inject(EventsService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

export const titleDetailResolver: ResolveFn<string> = (route, state) => {
  const service = inject(EventsService);
  const id = +route.paramMap.get('id')!;
  service.getById(id).subscribe();
  const event = service.getCurrent();
  if (!event) return 'Detalle de cita';
  const title = `Detalle de cita - ${event.patient?.fullName}`;
  return title;
}

export const titleEditResolver: ResolveFn<string> = (route, state) => {
  const service = inject(EventsService);
  const id = +route.paramMap.get('id')!;
  service.getById(id).subscribe();
  const event = service.getCurrent();
  if (!event) return 'Editar cita';
  const title = `Editar cita - ${event.patient?.fullName}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Citas', data: { breadcrumb: 'Citas', },
      component: EventsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de citas', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nuevo cita', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/edit', title: titleEditResolver, data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: itemResolver },
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
  imports: [ CommonModule, EventsRoutingModule, LayoutModule, ]
})
export class EventsModule { }
