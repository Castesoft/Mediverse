import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, inject, input, model, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { DateRange } from "src/app/_models/base/dateRange";
import { countLines } from "src/app/_utils/util";

@Component({
  selector: "div[controlTextarea3]",
  templateUrl: "./control-textarea-3.component.html",
  styleUrl: "./control-textarea-3.component.scss",
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, Forms2HelperModule ]
})
export class ControlTextarea3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  height = signal<number>(0);

  // Show bottom margins (mb-10)
  showBottomMargin = input<boolean>(true);

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  class = "fw-semibold mb-0";

  @HostBinding("class") get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper()) {
        this.class += " w-100";
      } else {
        this.class += " col-auto px-0";
      }

      this.control.set(this.control().setValidation(this.validation.active()));

      this.height.set(countLines(this.control().value as string));

      if (this.showBottomMargin()) {
        this.class += ` mb-10`;
      }

      this.control().valueChanges.subscribe({
        next: (value: any) => {
          this.height.set(countLines(value));
        }
      });
    });
  }
}
