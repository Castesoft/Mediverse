import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, model } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsService } from "src/app/_services/forms.service";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { DateRange } from "src/app/_models/types";

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
  parent = computed<FormGroup2<any>>(() => {
    return this.control().parent as FormGroup2<any>;
  });

  validation = false;

  constructor() {

    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    });

  }
}
