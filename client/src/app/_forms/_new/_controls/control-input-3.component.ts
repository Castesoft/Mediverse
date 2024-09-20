import { CommonModule } from "@angular/common";
import { Component, inject, model, effect, HostBinding } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { DateRange } from "src/app/_models/types";
import { FormsService } from "src/app/_services/forms.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: {
    'autocomplete': 'false',
    'spellcheck': 'false',
  },
  selector: 'input[controlInput3]',
  template: ``,
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, CommonModule, CdkModule, MaterialModule, ],
})
export class ControlInput3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();

  validation = false;
  baseClass = 'form-control text-body ';

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    })
  }

  @HostBinding('class') get class() {
    if (this.control().type === 'chips' || this.control().type === 'search') { return ''; }
    if (this.control().type === 'search') { return 'form-control search-input search'; }
    if (this.control().submitted && this.control().invalid) {
      return this.baseClass + ' is-invalid';
    }
    else if (this.control().submitted && this.control().valid) {
      return this.baseClass + ' is-valid';
    }
    return this.baseClass;
  }

  @HostBinding('type') get type() {
    switch (this.control().type) {
      case 'searchDate':
        return 'text';
      case 'search':
        return 'text';
      case 'textMat':
        return 'text';
      case 'numberMat':
        return 'number';
      default:
        return this.control().type;
    }
  }

  @HostBinding('placeholder') get placeholder() {
    return ((this.control().root as FormGroup2<any>).use !== 'detail' && this.control().placeholder) ? this.control().placeholder : '';
  }

  @HostBinding('attr.aria-describedby') get ariaDescribedBy() {
    return this.control().helperText ? this.control().name + 'helpBlock' : null;
  }

  @HostBinding('attr.aria-label') get ariaLabel() {
    return this.control().label + ' input';
  }

  @HostBinding('readonly') get readonly() {
    return this.control().isReadonly;
  }

  @HostBinding('id') get id() {
    return this.control().id;
  }

}
