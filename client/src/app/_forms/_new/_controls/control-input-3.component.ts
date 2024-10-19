import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, inject, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { DateRange } from "src/app/_models/types";
import { FormsService } from "src/app/_services/forms.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: {
    "autocomplete": "false",
    "spellcheck": "false"
  },
  selector: "input[controlInput3]",
  template: ``,
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, CdkModule, MaterialModule]
})
export class ControlInput3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  validation = false;
  baseClass = "form-control form-control-solid";

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    });
  }

  @HostBinding("class") get class() {
    if (this.control().type === "chips" || this.control().type === "search") { return ""; }
    if (this.control().type === "search") { return "form-control search-input search"; }
    if ((this.root().submitted) && this.control().invalid) {
      return this.baseClass + " is-invalid";
    } else if ((this.root().submitted) && this.control().valid) {
      return this.baseClass + " is-valid";
    }
    return this.baseClass;
  }

  @HostBinding("type") get type() {
    switch (this.control().type) {
      case "searchDate":
        return "text";
      case "search":
        return "text";
      case "textMat":
        return "text";
      case "numberMat":
        return "number";
      default:
        return this.control().type;
    }
  }

  @HostBinding('placeholder') get placeholder() {
    if (this.control().isDisabled || this.control().disabled) return '';
    else if ((this.control().root as FormGroup2<any>).use !== 'detail' && this.control().placeholder) return this.control().placeholder;
    else return '';
  }

  @HostBinding("attr.aria-describedby") get ariaDescribedBy() {
    return this.control().helperText ? this.control().name + "helpBlock" : null;
  }

  @HostBinding("attr.aria-label") get ariaLabel() {
    return this.control().label + " input";
  }

  @HostBinding("readonly") get readonly() {
    return this.control().isReadonly;
  }

  @HostBinding("id") get id() {
    return this.control().id;
  }

  @HostBinding('value') get value() {
    return this.control().value;
  }

  @HostBinding('disabled') get disabled() {
    return this.control().isDisabled || this.control().disabled;
  }

}
