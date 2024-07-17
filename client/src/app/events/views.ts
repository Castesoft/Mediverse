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
  selector: 'div[eventDetailView]',
  template: `
    <!--    <div-->
    <!--      eventHeader-->
    <!--      [id]="id()"-->
    <!--      [item]="item()"-->
    <!--      [key]="key()"-->
    <!--      [use]="use()"-->
    <!--      [view]="view()"-->
    <!--     -->
    <!--    ></div>-->
    <!--    <div eventForm [use]="use()" [id]="id()" [view]="view()"></div>-->
  `,
  standalone: true,
  imports: [EventFormComponent],
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


