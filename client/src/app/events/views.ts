import { Component, input, viewChild } from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { Event } from "src/app/_models/event";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { EventFormComponent } from "src/app/events/components/event-form.component";

@Component({
  selector: 'div[eventNewView]',
  template: `
  <div eventForm [use]="use()" [id]="null" [view]="view()" [role]="role()"></div>
  `,
  standalone: true,
  imports: [ EventFormComponent, ModalWrapperModule, ],
})
export class EventNewComponent {
  use = input.required<FormUse>();
  view = input.required<View>();
  role = input.required<Role>();

  formComponent = viewChild.required(EventFormComponent);

  onFillForm = () => this.formComponent().fillForm();
}

@Component({
  selector: 'div[cardFlush]',
  host: { class: 'card card-flush py-4', },
  template: `
    <div class="card-header">
      <div class="card-title">
        <h2>{{ title() }}</h2>
      </div>
    </div>
    <div class="card-body pt-0">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
})
export class CardFlushComponent {
  title = input.required<string>();
}

@Component({
  selector: 'div[eventDetailView]',
  template: `
  <div class="form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework">
    <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
      <div cardFlush [title]="'Paciente'">
        {{ item().patient?.fullName }}
      </div>
      <div cardFlush [title]="'Servicio'">
        {{ item().service?.name }}
      </div>
      <div cardFlush [title]="'Fecha y hora'">

      </div>
    </div>
    <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
      <ul class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-n2"></ul>
      <div class="tab-content">

      </div>
    </div>
  </div>
  `,
  standalone: true,
  imports: [EventFormComponent, CardFlushComponent,],
})
export class EventDetailComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Event>();
  key = input.required<string | undefined>();
}

@Component({
  selector: 'div[eventEditView]',
  template: `
  <div eventForm [use]="use()" [id]="id()" [view]="view()" [role]="role()"></div>
  `,
  standalone: true,
  imports: [ EventFormComponent, ModalWrapperModule, ],
})
export class EventEditComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Event>();
  key = input.required<string | undefined>();
  role = input.required<Role>();
}


