import { Component, HostBinding, inject, model } from "@angular/core";
import { OptionalSpan3Component } from "src/app/_forms2/helper/optional-span-3.component";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { DateRange } from "src/app/_models/base/dateRange";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  selector: "label[controlLabel3]",
  host: { class: "" },
  templateUrl: './control-label-3.component.html',
  standalone: true,
  imports: [ OptionalSpan3Component, ]
})
export class ControlLabel3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | SelectOption[] | File | File[] | null>>();

  @HostBinding("class") get class() {
    return this.control().orientation === "inline" ? "col-form-label fw-semibold text-nowrap d-flex" : "form-label fw-semibold text-nowrap";
  }

  @HostBinding("for") get for() {
    return this.control().id;
  }
}
