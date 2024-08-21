import { CommonModule } from "@angular/common";
import { Component, effect, HostBinding, inject, model } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Control, SelectItem } from "src/app/_forms/form";
import { FormsService } from "src/app/_services/forms.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: {
    'autocomplete': 'false',
    'spellcheck': 'false',
  },
  selector: 'input[inputComponent]',
  template: ``,
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, CommonModule, CdkModule, MaterialModule, ],
})
export class InputComponent {
  service = inject(FormsService);

  control = model.required<Control<string | SelectItem | SelectItem[]>>();

  validation = false;
  baseClass = 'form-control mb-3 mb-lg-0';

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    })
  }

  @HostBinding('class') get class() {
    if (this.control().type === 'chips' || this.control().type === 'search') { return ''; }
    if (this.control().type === 'search') { return 'form-control search-input search'; }
    if (this.control().submitted && this.control().formControl.invalid) {
      return this.baseClass + ' is-invalid';
    }
    else if (this.control().submitted && this.control().formControl.valid) {
      return this.baseClass + ' is-valid';
    }

    switch (this.control().style) {
      case 'solid':
        this.baseClass = `${this.baseClass} form-control-solid`;
        break;
      case 'normal':
        // this.baseClass = 'form-control mb-3 mb-lg-0';
        break;
    }

    if (this.control().type === 'check') {
      this.baseClass = 'form-check-input';
    }

    return this.baseClass;
  }

  @HostBinding('type') get type() {
    switch (this.control().type) {
      case 'searchDate':
        return 'text';
      case 'search':
        return 'text';
      case 'check':
        return 'checkbox';
      default:
        return this.control().type;
    }
  }

  @HostBinding('placeholder') get placeholder() {
    return (this.control().use !== 'detail' && this.control().placeholder) ? this.control().placeholder : '';
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
