import { CommonModule } from "@angular/common";
import { Component, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { Control } from "src/app/_models/forms/deprecated/control";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  host: { class: 'fw-semibold mb-0 w-100', },
  selector: 'div[controlTextarea2]',
  template: `
      @if(control().showLabel) {
<label [for]="control().id" class="form-label fw-semibold ">
  {{ control().label }}
  {{ control().required ? '*' : null}}
  @if(control().optional){@if (validation.isOptional(control().formControl) || !control().isReadonly) {
  <span optionalSpan></span>
  }}
  @if (control().isNew) {
  <span newBadge></span>
  }
</label>
}
    <textarea
      [attr.aria-describedby]="control().helperText ? control().name + 'helpBlock' : null"
  [attr.aria-label]="control().label + ' input'"
      [formControl]="$any(control().formControl)"
      [autocomplete]="'off'" [spellcheck]="'false'" [id]="control().id"
      [ngClass]="{
      'is-invalid': control().submitted && control().formControl.invalid,
      'is-valid': control().submitted && control().formControl.valid,
    }"
      [readonly]="control().isReadonly"
      class="form-control text-body "
    >
</textarea>

@if (control().formControl.errors) {
<div invalidFeedback [errors]="control().errors" [control]="control().formControl" [submitted]="control().submitted">
</div>
}
@if (control().helperText) {
<div helpBlock [controlName]="control().name" [formText]="control().helperText"></div>
}

  `,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent]
})
export class ControlTextarea2Component {
  validation = inject(ValidationService);

  control = model.required<Control<string>>();

  constructor() {

    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));
    })

  }
}
