import { Component, computed, effect, HostBinding, inject, model, ModelSignal, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { CommonModule } from '@angular/common';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { InvalidFeedback3Component } from 'src/app/_forms2/helper/invalid-feedback-3.component';
import { HelpBlock3Component } from 'src/app/_forms2/helper/help-block-3.component';
import { DateRange } from "src/app/_models/base/dateRange";
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

@Component({
  selector: 'div[controlSlide3]',
  templateUrl: './control-slide-3.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InvalidFeedback3Component,
    HelpBlock3Component,
    CommonModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlSlide3Component {
  validation = inject(ValidationService);

  control: ModelSignal<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required();
  root: Signal<FormGroup2<any>> = computed(() => { return this.control().root as FormGroup2<any>; });
  class: string = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper()) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }
}
