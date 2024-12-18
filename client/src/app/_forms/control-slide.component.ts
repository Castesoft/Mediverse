import { CommonModule } from "@angular/common";
import { Component, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { Control } from "src/app/_models/forms/deprecated/control";
import { ValidationService } from "src/app/_services/validation.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

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
    CommonModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlSlideComponent {
  validation = inject(ValidationService);

  control = model.required<Control<boolean>>();

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }
}
