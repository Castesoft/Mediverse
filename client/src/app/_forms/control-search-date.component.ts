import { CommonModule } from "@angular/common";
import { Component, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InputComponent } from "src/app/_forms/helpers/input.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { Control } from "src/app/_models/forms/deprecated/control";
import { IconsService } from "src/app/_services/icons.service";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  host: { class: '' },
  selector: '[controlSearchDate]',
  template: `
    <div class="search-box w-100 me-2">
      <div class="position-relative">
        <input
          inputComponent
          [(control)]="control"
          [formControl]="$any(control().formControl)"
        />
        <fa-icon [icon]="icons.faCalendar" class="search-box-icon"></fa-icon>
      </div>
    </div>

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
    InputComponent,
    CommonModule,
    FontAwesomeModule,
  ],
})
export class ControlSearchDateComponent {
  validation = inject(ValidationService);
  icons = inject(IconsService);

  control = model.required<Control<string>>();

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }
}
