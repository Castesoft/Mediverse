import { Component, effect, HostBinding, inject, input, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { ValidationService } from "src/app/_services/validation.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { DateRange } from "src/app/_models/base/dateRange";

@Component({
  selector: '[controlDateRange3]',
  templateUrl: './control-date-range-3.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule, CdkModule, MaterialModule, FormsModule,
    Forms2HelperModule,
   ],
  providers: [ DatePipe,],
  standalone: true,
})
export class ControlDateRange3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<DateRange>>();
  fromWrapper = model.required<boolean>();
  minMode = input<"day" | "month" | "year">("day");
  maxDate = input<Date | null>();

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

      if (this.control().isReadonly) {
        this.control().updateValueAndValidity();
      }
    });
  }
}
