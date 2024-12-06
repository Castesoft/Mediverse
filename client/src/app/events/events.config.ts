import { LayoutModule } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal, NgModule } from "@angular/core";
import { RouterModule, ActivatedRoute, Router, ResolveFn } from "@angular/router";
import { createId } from "@paralleldrive/cuid2";
import { Subject, takeUntil } from "rxjs";
import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Sections } from "src/app/_models/sections/sectionTypes";
import { Role } from "src/app/_models/types";
import { EventsService } from "src/app/_services/events.service";
import { EventDetailComponent } from "src/app/events/components/event-detail/event-detail.component";
import { EventsDisplayComponent } from "src/app/events/components/events-display/events-display.component";
import { EventNewComponent } from "src/app/events/views";

@Component({
  selector: 'events-route',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
})
export class EventsComponent {
}

@Component({
  selector: 'events-catalog-route',
  template: `
    <div card>
      <app-events-display
        [(key)]="key"
        [mode]="mode"
        [(view)]="view"
        [role]="role"
      ></app-events-display>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, EventsDisplayComponent, LayoutModule],
})
export class CatalogComponent {

}

@Component({
  selector: 'event-detail-route',
  template: `
      <div
        eventDetail
        [(use)]="use"
        [(view)]="view"
        [(item)]="item"
        [(key)]="key"
      ></div>
  `,
  standalone: true,
  imports: [RouterModule, EventDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item = signal<Event | null>(null);
  use = signal<FormUse>('detail');
  view = signal<View>('page');
  key = signal<string | null>(null);

  section: Sections = 'events';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key.set(navigation?.extras?.state?.['key'] || createId());
  }
}

@Component({
  selector: 'event-edit-route',
  template: `
      <div
        eventDetail
        [(use)]="use"
        [(view)]="view"
        [(key)]="key"
        [(item)]="item"
      ></div>
  `,
  standalone: true,
  imports: [EventDetailComponent, RouterModule, LayoutModule],
})
export class EditComponent {
  private eventsService = inject(EventsService);
  private ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);

  item = signal<Event | null>(null);
  use = signal<FormUse>('edit');
  view = signal<View>('page');
  key = signal<string | null>(null);

  label?: string;
  section: Sections = 'events';
  role = signal<Role>('Patient');

  constructor() {
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data): void => {
        this.item.set(data['item']);
      },
    });
  }

}

@Component({
  selector: 'event-new-route',
  template: `
    <div eventNewView [(use)]="use" [(view)]="view" [role]="role"
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
      path: '', title: 'Citas', data: {breadcrumb: 'Citas',},
      component: EventsComponent, runGuardsAndResolvers: 'always',
      children: [
        {path: ':span', component: CatalogComponent, title: 'Catálogo de citas', data: {breadcrumb: 'Catálogo',},},
        {path: 'create', component: NewComponent, title: 'Crear nuevo cita', data: {breadcrumb: 'Nuevo',},},
        {
          path: ':id', title: titleDetailResolver, data: {breadcrumb: 'Detalle',},
          component: DetailComponent,
          resolve: {item: itemResolver},
        },
        {
          path: ':id/edit', title: titleEditResolver, data: {breadcrumb: 'Editar',},
          component: EditComponent,
          resolve: {item: itemResolver},
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}

@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [CommonModule, EventsRoutingModule, LayoutModule,]
})
export class EventsModule {
}
