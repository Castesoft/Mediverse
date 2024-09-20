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
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';

@Component({
  host: { class: 'fw-semibold mb-0 w-100 text-body' },
  selector: 'div[controlSlide]',
  template: `
    @if (control().orientation === 'inline') {
      <div class="d-flex align-items-center gap-2">
        <mat-slide-toggle [formControl]="$any(control().formControl)" [id]="control().id">
          <span class="col-form-label fw-semibold  text-nowrap">{{control().label}}</span>
        </mat-slide-toggle>
      </div>
    } @else {
      <mat-slide-toggle [formControlName]="control().name">{{control().label}}</mat-slide-toggle>
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
    CdkModule,
    MaterialModule,
    ControlLabelComponent,
  ],
})
export class ControlSlideComponent {
  service = inject(FormsService);

  control = model.required<Control<boolean>>();

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
