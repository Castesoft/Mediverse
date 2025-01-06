import { CommonModule } from '@angular/common';
import { Component, inject, model, effect, HostBinding, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlInput3Component } from 'src/app/_forms2/controls/control-input-3.component';
import { HelpBlock3Component } from 'src/app/_forms2/helper/help-block-3.component';
import { InvalidFeedback3Component } from 'src/app/_forms2/helper/invalid-feedback-3.component';
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { DateRange } from "src/app/_models/base/dateRange";
import { ValidationService } from "src/app/_services/validation.service";
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

@Component({
  selector: '[controlSearchText3]',
  templateUrl: './control-search-text-3.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InvalidFeedback3Component,
    HelpBlock3Component,
    ControlInput3Component,
    CommonModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlSearchText3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });
  class = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper() === true) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }
}
