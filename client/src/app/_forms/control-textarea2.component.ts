import { NgClass, KeyValuePipe, NgStyle } from "@angular/common";
import { Component, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Control } from "src/app/_forms/form";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { FormsService } from "src/app/_services/forms.service";

@Component({
  host: { class: 'fw-semibold mb-0 w-100', },
  selector: 'div[controlTextarea2]',
  template: `
      @if(control().showLabel) {
<label [for]="control().id" class="form-label fw-semibold fs-8">
  {{ control().label }}
  {{ control().required ? '*' : null}}
  @if(control().optional){@if (service.isOptional(control().formControl) || !control().isReadonly) {
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
      class="form-control text-body fs-8"
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
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, NgStyle, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent]
})
export class ControlTextarea2Component {
  service = inject(FormsService);

  control = model.required<Control<string>>();

  validation = false;

  constructor() {

    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    })

  }
}
