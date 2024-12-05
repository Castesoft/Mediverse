import { Component, computed, effect, HostBinding, inject, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { CommonModule } from "@angular/common";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { DateRange } from "src/app/_models/base/dateRange";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "div[controlText3]",
  templateUrl: "./control-text-3.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    FormsModule,
    CommonModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlText3Component {
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
