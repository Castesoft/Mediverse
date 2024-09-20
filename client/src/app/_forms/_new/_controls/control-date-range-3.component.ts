import { Component, effect, inject, input, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsService } from "src/app/_services/forms.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { FormControl2 } from "src/app/_forms/form2";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { DateRange } from "src/app/_models/types";

@Component({
  host: { class: 'fw-semibold mb-0 w-100', },
  selector: '[controlDateRange3]',
  templateUrl: './control-date-range-3.component.html',
  imports: [
    ReactiveFormsModule,
    FaIconComponent, CommonModule, CdkModule, MaterialModule, FormsModule,
    FormNewHelperModule,
   ],
  providers: [ DatePipe,],
  standalone: true,
})
export class ControlDateRange3Component {
  service = inject(FormsService);
  icons = inject(IconsService);

  control = model.required<FormControl2<DateRange>>();
  minMode = input<"day" | "month" | "year">("day");
  maxDate = input<Date | undefined>();

  constructor() {
    effect(() => {
      if (this.control().isReadonly) {
        this.control().updateValueAndValidity();
      }
    }, { allowSignalWrites: true});
  }
}
