import { CommonModule } from "@angular/common";
import { Component, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Control } from "src/app/_forms/form";
import { ControlLabelComponent } from "src/app/_forms/helpers/control-label.component";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InputComponent } from "src/app/_forms/helpers/input.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";

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
    OptionalSpanComponent,
    NewBadgeComponent,
    ControlLabelComponent,
    InputComponent,
    CommonModule,
    FontAwesomeModule,
  ],
})
export class ControlSearchDateComponent {
  service = inject(FormsService);
  icons = inject(IconsService);

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
