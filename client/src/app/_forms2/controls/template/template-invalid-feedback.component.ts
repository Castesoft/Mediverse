import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, effect, inject, model, signal } from "@angular/core";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: { class: 'fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback', },
  selector: 'div[templateInvalidFeedback]',
  template: `
  @if(root().submitted === true) {
    @for(message of control().errorMessages; let idx = $index; track idx) {
      {{ message }}
    }
  }
  `,
  standalone: true,
  imports: [ CommonModule, ],
  providers: [ DatePipe ],
})
export class TemplateInvalidFeedbackComponent {
  datePipe = inject(DatePipe);

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  control = model.required<FormControl2<any>>();

  messages = signal<string[]>([]);

  constructor() {
    effect(() => {

    });
  }
}

