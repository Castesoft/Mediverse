import { Component, effect, inject, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { FormsService } from 'src/app/_services/forms.service';
import { OptionalSpanComponent } from 'src/app/_forms/helpers/optional-span.component';
import { NewBadgeComponent } from 'src/app/_forms/helpers/new-badge.component';
import { Control } from 'src/app/_forms/form';
import { ControlLabelComponent } from 'src/app/_forms/helpers/control-label.component';
import { InputComponent } from 'src/app/_forms/helpers/input.component';
import { CommonModule } from '@angular/common';

@Component({
  host: { class: 'fw-semibold mb-0 w-100' },
  selector: 'div[controlCheck2]',
  template: `
    <div class="form-check form-check-custom form-check-solid">
      @if (control().showLabel) {
        <input
        inputComponent
        [(control)]="control"
        [formControl]="$any(control().formControl)"
        />
        <label controlLabel [(control)]="control"></label>
      }
    </div>
    @if (control().formControl.errors) {
    <div
      invalidFeedback
      [errors]="control().errors"
      [control]="control().formControl"
      [submitted]="control().submitted"
    ></div>
    } @if (control().helperText) {
    <div
      helpBlock
      [controlName]="control().name"
      [formText]="control().helperText"
    ></div>
    }
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InvalidFeedbackComponent,
    HelpBlockComponent,
    OptionalSpanComponent,
    NewBadgeComponent,
    ControlLabelComponent,
    InputComponent,
    CommonModule,
  ],
})
export class ControlCheck2Component {
  service = inject(FormsService);

  control = model.required<Control<string>>();

  validation = false;

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({
        next: (validation) =>
          this.control.set(this.control().setValidation(validation)),
      });
    });
  }
}
