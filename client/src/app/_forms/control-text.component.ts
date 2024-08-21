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
  selector: 'div[controlText]',
  template: `
    @if (control().orientation === 'inline') {
      <div class="d-flex align-items-center gap-2">
        @if (control().showLabel) {
          <label controlLabel [(control)]="control"></label>
        }
        <input
          inputComponent
          [(control)]="control"
          [formControl]="$any(control().formControl)"
        />
      </div>
    } @else {
      @if (control().showLabel) {
        <label controlLabel [(control)]="control"></label>
      }

      <input
        inputComponent
        [(control)]="control"
        [formControl]="$any(control().formControl)"
      />
    }

    @if (control().formControl.errors) {
      <div
        invalidFeedback
        [errors]="control().errors"
        [control]="control().formControl"
        [submitted]="control().submitted"
      ></div>
    }
    @if (control().helperText) {
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
export class ControlTextComponent {
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
