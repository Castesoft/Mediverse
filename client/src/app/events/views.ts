import { Component, input, viewChild } from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { Event } from "src/app/_models/event";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { EventFormComponent } from "src/app/events/components/event-form/event-form.component";

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


