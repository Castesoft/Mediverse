import {
  Component,
  computed,
  effect,
  HostBinding,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal, Signal,
  signal, WritableSignal
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { ValidationService } from "src/app/_services/validation.service";
import { IconsService } from "src/app/_services/icons.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { DateRange } from "src/app/_models/base/dateRange";
import {
  TemplateInvalidFeedbackComponent
} from 'src/app/_forms2/controls/template/template-invalid-feedback.component';

@Component({
  selector: 'div[templateControlDate]',
  templateUrl: './template-control-date.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule, CdkModule, MaterialModule, TemplateInvalidFeedbackComponent,
    Forms2HelperModule,
  ],
  providers: [ DatePipe, ],
  standalone: true,
})
export class TemplateControlDateComponent {
  readonly validation: ValidationService = inject(ValidationService);
  readonly icons: IconsService = inject(IconsService);

  control: ModelSignal<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required();
  minMode: InputSignal<"day" | "month" | "year"> = input<"day" | "month" | "year">("day");
  maxDate: InputSignal<Date | null | undefined> = input();
  readonly datePipe: DatePipe = inject(DatePipe);

  tooltipText: WritableSignal<string | null> = signal(null);

  root: Signal<FormGroup2<any>> = computed(() => {
    return this.control().root as FormGroup2<any>;
  });

  class = 'fw-semibold mb-0';

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
