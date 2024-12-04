import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, model, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsService } from "src/app/_services/forms.service";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { DateRange } from "src/app/_models/types";
import { countLines } from "src/app/_utils/util";

@Component({
  host: { class: "fw-semibold mb-0 w-100" },
  selector: "div[controlTextarea3]",
  templateUrl: "./control-textarea-3.component.html",
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, FormNewHelperModule, ],
})
export class ControlTextarea3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  height = signal<number>(0);

  validation = false;

  constructor() {

    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });

      this.height.set(countLines(this.control().value as string));

      this.control().valueChanges.subscribe({
        next: (value: any) => {
          this.height.set(countLines(value));
        }
      })
    });

  }
}
