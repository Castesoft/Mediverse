import { Component, computed, effect, inject, input, model, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsService } from "src/app/_services/forms.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { SelectOption } from "src/app/_forms/form";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { DateRange } from "src/app/_models/types";

@Component({
  host: { class: 'fw-semibold mb-0 w-100', },
  selector: '[controlDate3]',
  templateUrl: './control-date-3.component.html',
  imports: [
    ReactiveFormsModule,
    FaIconComponent, CommonModule, CdkModule, MaterialModule,
    FormNewHelperModule,
   ],
  providers: [ DatePipe,],
  standalone: true,
})
export class ControlDate3Component {
  service = inject(FormsService);
  icons = inject(IconsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  minMode = input<"day" | "month" | "year">("day");
  maxDate = input<Date | undefined>();
  datePipe = inject(DatePipe);

  tooltipText = signal<string | null>(null);

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  constructor() {
    effect(() => {
      if (this.control().isReadonly) {
        this.control().updateValueAndValidity();
      }

      if (this.control().disabled && this.control().value) {
        this.tooltipText.set(this.datePipe.transform(this.control().value! as Date, 'fullDate', '', 'es-MX'));
      }
    });
  }
}
