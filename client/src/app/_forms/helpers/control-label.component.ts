import { Component, effect, HostBinding, inject, input, model } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { Control, ControlOrientation } from "src/app/_forms/form";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { FormsService } from "src/app/_services/forms.service";
import { createId } from "@paralleldrive/cuid2";

@Component({
  selector: "label[controlLabel]",
  host: { class: "" },
  template: `
    {{ control().label }}
    {{ control().required ? '*' : null }}
    @if (control().optional) {
      @if (service.isOptional(control().formControl) || !control().isReadonly) {
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
  service = inject(FormsService);

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
      @if (service.isOptional(control()) || !isReadonly()) {
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
  service = inject(FormsService);

  control = input.required<AbstractControl<string | null | undefined, string | null | undefined>>();
  name = input.required<string>();

  id = model<string>();

  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  errors = input<{ [key: string]: string }>({});
  submitted = input<boolean>(false);
  formText = input<string>();

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
    }, { allowSignalWrites: true });
  }


  get invalid(): boolean { return this.control().invalid && (this.control().dirty || this.submitted()); }

  get touched(): boolean { return this.control().touched || this.submitted(); }
}
