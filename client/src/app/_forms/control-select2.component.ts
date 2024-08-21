import { DatePipe, NgClass, KeyValuePipe, NgTemplateOutlet } from "@angular/common";
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
  selector: 'div[controlSelect2]',
  template: `
  @if(control().orientation === 'inline') {
    <div class="d-flex align-items-center gap-2">
      @if(control().showLabel) {
        <label [for]="control().id" class="col-form-label fw-semibold fs-8 text-nowrap">
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
      <select
  [attr.aria-describedby]="control().helperText ? control().name + 'helpBlock' : null"
  [attr.aria-label]="control().label + ' input'"
  [formControl]="$any(control().formControl)"
  [id]="control().id"
  [ngClass]="{
      'is-invalid': control().submitted && control().formControl.invalid,
      'is-valid': control().submitted && control().formControl.valid,
    }"
  class="form-select fs-8 text-body"
>
  @if ((control().use !== 'detail' && control().placeholder) ? control().placeholder : '') {
    <option value="" disabled selected class="text-muted">{{ control().placeholder }}</option>
  }
  @for (option of control().options; track $index) {
    <option value="{{option.value}}">
      {{ option.value }}
    </option>
  }
</select>
</div>
  } @else {
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

<select
  [attr.aria-describedby]="control().helperText ? control().name + 'helpBlock' : null"
  [attr.aria-label]="control().label + ' input'"
  [formControl]="$any(control().formControl)"
  [id]="control().id"
  [ngClass]="{
      'is-invalid': control().submitted && control().formControl.invalid,
      'is-valid': control().submitted && control().formControl.valid,
    }"
  class="form-select fs-8 text-body"
>
  @if ((control().use !== 'detail' && control().placeholder) ? control().placeholder : '') {
    <option value="" disabled selected class="text-muted">{{ control().placeholder }}</option>
  }
  @for (option of control().options; track $index) {
    <option value="{{option.value}}">
      {{ option.value }}
    </option>
  }
</select>
  }

  @if (control().formControl.errors) {
<div invalidFeedback [errors]="control().errors" [control]="control().formControl" [submitted]="control().submitted">
</div>
}
@if (control().helperText) {
<div helpBlock [controlName]="control().name" [formText]="control().helperText"></div>
}`,
  standalone: true,
  providers: [ DatePipe, ],
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, NgTemplateOutlet,
    InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent,
   ],
})
export class ControlSelect2Component {
  service = inject(FormsService);

  control = model.required<Control<string>>();

  validation = false;

  constructor() {

    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    })

  }
}

