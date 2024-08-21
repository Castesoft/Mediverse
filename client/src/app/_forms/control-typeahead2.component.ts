import { CommonModule } from "@angular/common";
import { Component, inject, model, computed, output, effect } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TypeaheadModule, TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { Control } from "src/app/_forms/form";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { FormsService } from "src/app/_services/forms.service";

@Component({
  selector: "[controlTypeahead2]",
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
      <input
[formControl]="$any(control().formControl)"
  [placeholder]="(control().use !== 'detail' && control().placeholder) ? control().placeholder : ''"
  [autocomplete]="false" [spellcheck]="false" [id]="control().id" [readonly]="control().isReadonly"
  class="form-control text-body fs-8" [ngClass]="{
      'is-invalid': control().submitted && control().formControl.invalid,
      'is-valid': control().submitted && control().formControl.valid,
    }" [attr.aria-describedby]="control().helperText ? control().name + 'helpBlock' : null"
  [attr.aria-label]="control().label + ' input'"
  (typeaheadLoading)="onLoading.emit($event)"
  (typeaheadOnSelect)="onSelect.emit($event)"
  [adaptivePosition]="true"
  [style.border-bottom-right-radius.px]="control().isGroupSpan ? 0 : null"
  [style.border-top-right-radius.px]="control().isGroupSpan ? 0 : null"
  [typeaheadAsync]="control().typeahead.async"
  [typeaheadHideResultsOnBlur]="true"
  [typeaheadMinLength]="0"
  [typeaheadOptionField]="control().typeahead.field"
  [typeaheadOptionsInScrollableView]="control().typeahead.scrollable"
  [typeaheadScrollable]="true"
  [typeaheadOptionsLimit]="control().typeahead.limit"
  [typeahead]="control().typeahead.options"
>
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

<input
[formControl]="$any(control().formControl)"
  [placeholder]="(control().use !== 'detail' && control().placeholder) ? control().placeholder : ''"
  [autocomplete]="false" [spellcheck]="false" [id]="control().id" [readonly]="control().isReadonly"
  class="form-control text-body fs-8" [ngClass]="{
      'is-invalid': control().submitted && control().formControl.invalid,
      'is-valid': control().submitted && control().formControl.valid,
    }" [attr.aria-describedby]="control().helperText ? control().name + 'helpBlock' : null"
  [attr.aria-label]="control().label + ' input'"
  (typeaheadLoading)="onLoading.emit($event)"
  (typeaheadOnSelect)="onSelect.emit($event)"
  [adaptivePosition]="true"
  [style.border-bottom-right-radius.px]="control().isGroupSpan ? 0 : null"
  [style.border-top-right-radius.px]="control().isGroupSpan ? 0 : null"
  [typeaheadAsync]="control().typeahead.async"
  [typeaheadHideResultsOnBlur]="true"
  [typeaheadMinLength]="0"
  [typeaheadOptionField]="control().typeahead.field"
  [typeaheadOptionsInScrollableView]="control().typeahead.scrollable"
  [typeaheadScrollable]="true"
  [typeaheadOptionsLimit]="control().typeahead.limit"
  [typeahead]="options()"
>
  }

  @if (control().formControl.errors) {
<div invalidFeedback [errors]="control().errors" [control]="control().formControl" [submitted]="control().submitted">
</div>
}
@if (control().helperText) {
<div helpBlock [controlName]="control().name" [formText]="control().helperText"></div>
}
  `,
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TypeaheadModule, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent, CommonModule,],

})
export class ControlTypeahead2Component {
  service = inject(FormsService);

  control = model.required<Control<string>>();
  options = computed(() => this.control().typeahead.options);

  onSelect = output<TypeaheadMatch>();
  onLoading = output<boolean>();

  validation = false;

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    })
  }
}
