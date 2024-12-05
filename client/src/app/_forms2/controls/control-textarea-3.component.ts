import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, inject, model, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { DateRange } from "src/app/_models/base/dateRange";
import { countLines } from "src/app/_utils/util";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "div[controlTextarea3]",
  templateUrl: "./control-textarea-3.component.html",
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
export class ControlTextarea3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  parent = computed<FormGroup2<any>>(() => {
    return this.control().parent as FormGroup2<any>;
  });

  height = signal<number>(0);
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

      this.height.set(countLines(this.control().value as string));

      this.control().valueChanges.subscribe({
        next: (value: any) => {
          this.height.set(countLines(value));
        }
      })
    });

  }
}
