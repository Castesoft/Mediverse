import { Component, computed, effect, HostBinding, inject, input, model, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { DateRange } from "src/app/_models/base/dateRange";

@Component({
  selector: '[controlTime3]',
  templateUrl: './control-time-3.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule, CdkModule, MaterialModule,
    Forms2HelperModule,
   ],
  providers: [ DatePipe,],
  standalone: true,
})
export class ControlTime3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  minMode = input<"day" | "month" | "year">("day");
  maxDate = input<Date | null>();
  datePipe = inject(DatePipe);

  tooltipText = signal<string | null>(null);

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

      if (this.control().isReadonly) {
        this.control().updateValueAndValidity();
      }

      if (this.control().disabled && this.control().value) {
        this.tooltipText.set(this.datePipe.transform(this.control().value! as Date, 'fullDate', '', 'es-MX'));
      }
    });
  }
}
