import { CommonModule, DatePipe } from "@angular/common";
import { Component, effect, inject, model, signal } from "@angular/core";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: { class: '', },
  selector: 'div[invalidFeedback3]',
  template: `
  @if(submitted() === true) {
    @for(message of control().errorMessages; let idx = $index; track idx) {
      <mat-error>{{ message }}</mat-error>
    }
  }
  `,
  standalone: true,
  imports: [ CommonModule, MaterialModule, ],
  providers: [ DatePipe ],
})
export class InvalidFeedback3Component {
  datePipe = inject(DatePipe);

  submitted = model.required<boolean>();
  control = model.required<FormControl2<any>>();

  messages = signal<string[]>([]);

  constructor() {
    effect(() => {

    });
  }
}
