import { CommonModule } from "@angular/common";
import { Component, computed, model, ModelSignal, Signal } from "@angular/core";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

@Component({
  selector: 'div[templateInvalidFeedback]',
  template: `
    @if ((control().touched || control().dirty || root().submitted) && control().errorMessages.length > 0) {
      <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback">
        @for (message of control().errorMessages; track message) {
          <div>{{ message }}</div>
        }
      </div>
    }
  `,
  standalone: true,
  imports: [ CommonModule ],
})
export class TemplateInvalidFeedbackComponent {
  root: Signal<FormGroup2<any>> = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  control: ModelSignal<FormControl2<any>> = model.required<FormControl2<any>>();
}
