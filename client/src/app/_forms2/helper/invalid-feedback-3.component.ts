import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: 'div[invalidFeedback3]',
  template: `
    @if (root().submitted) {
      @for (message of control().errorMessages; let idx = $index; track idx) {
        <mat-error>{{ message }}</mat-error>
      }
    }
  `,
  imports: [ CommonModule, MaterialModule, ],
  providers: [ DatePipe ],
})
export class InvalidFeedback3Component {
  datePipe: DatePipe = inject(DatePipe);

  root: Signal<FormGroup2<any>> = computed(() => {
    return this.control().root as FormGroup2<any>;
  });

  control: ModelSignal<FormControl2<any>> = model.required();
  messages: WritableSignal<string[]> = signal([]);
}
