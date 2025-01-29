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
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: '[controlDate3]',
  templateUrl: './control-date-3.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CdkModule,
    MaterialModule,
    Forms2HelperModule,
  ],
  providers: [
    DatePipe,
    provideMomentDateAdapter(MY_FORMATS),
  ],
  standalone: true,
})
export class ControlDate3Component {
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
      if (this.fromWrapper()) {
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
