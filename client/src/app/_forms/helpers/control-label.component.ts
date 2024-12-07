import { Component, effect, HostBinding, inject, input, model } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { createId } from "@paralleldrive/cuid2";
import { ValidationService } from "src/app/_services/validation.service";
import { Control } from "src/app/_models/forms/deprecated/control";
import { ControlOrientation } from "src/app/_models/forms/formTypes";

@Component({
  selector: "label[controlLabel]",
  host: { class: "" },
  template: `
    {{ control().label }}
    {{ control().required ? '*' : null }}
    @if (control().optional) {
      @if (validation.isOptional(control().formControl) || !control().isReadonly) {
        <span optionalSpan></span>
      }
    }
    @if (control().isNew) {
      <span newBadge></span>
    }
  `,
  standalone: true,
  imports: [OptionalSpanComponent, NewBadgeComponent]
})
export class ControlLabelComponent {
  validation = inject(ValidationService);

  control = model.required<Control<Date | string | boolean>>();

  @HostBinding("class") get class() {
    return this.control().orientation === "inline" ? "col-form-label fw-semibold fs-8 text-nowrap" : "form-label fw-semibold fs-8 text-nowrap";
  }

  @HostBinding("for") get for() {
    return this.control().id;
  }
}


@Component({
  selector: "label[legacyControlLabel]",
  host: { class: "" },
  template: `
    {{ label() }}
    {{ !optional() ? '*' : null }}
    @if (optional()) {
      @if (validation.isOptional(control()) || !isReadonly()) {
        <span optionalSpan></span>
      }
    }
    @if (isNew()) {
      <span newBadge></span>
    }
  `,
  standalone: true,
  imports: [OptionalSpanComponent, NewBadgeComponent]
})
export class LegacyControlLabelComponent {
  validation = inject(ValidationService);

  control = input.required<AbstractControl<string | null | undefined, string | null | undefined>>();
  name = input.required<string>();

  id = model<string>();

  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  errors = input<{ [key: string]: string }>({});
  submitted = input<boolean>(false);
  formText = input<string | null>(null);

  label = input<string>("");
  isReadonly = input<boolean>(false);
  hideIsOptional = input<boolean>(false);
  fill = input<boolean>(false);
  showLabel = input<boolean>(true);
  orientation = input<ControlOrientation>("block");
  optional = input<boolean>(false);

  @HostBinding("class") get class() {
    return this.orientation() === "inline" ? "col-form-label fw-semibold fs-8 text-nowrap" : "form-label fw-semibold fs-8 text-nowrap";
  }

  @HostBinding("for") get for() {
    return this.id();
  }

  constructor() {
    effect(() => {
      if (!this.id()) {
        this.id.set(`${this.name()}${createId()}`);
      }
    });
  }


  get invalid(): boolean { return this.control().invalid && (this.control().dirty || this.submitted()); }

  get touched(): boolean { return this.control().touched || this.submitted(); }
}
