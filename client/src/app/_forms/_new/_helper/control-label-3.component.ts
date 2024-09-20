import { Component, HostBinding, inject, model } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NewBadge3Component } from "src/app/_forms/_new/_helper/new-badge-3.component";
import { OptionalSpan3Component } from "src/app/_forms/_new/_helper/optional-span-3.component";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2 } from "src/app/_forms/form2";
import { DateRange } from "src/app/_models/types";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  selector: "label[controlLabel3]",
  host: { class: "" },
  templateUrl: './control-label-3.component.html',
  // template: ``,
  standalone: true,
  imports: [OptionalSpan3Component, NewBadge3Component, FontAwesomeModule, ]
})
export class ControlLabel3Component {
  service = inject(FormsService);
  icons = inject(IconsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();

  @HostBinding("class") get class() {
    return this.control().orientation === "inline" ? "col-form-label fw-semibold  text-nowrap d-flex" : "form-label fw-semibold ";
  }

  @HostBinding("for") get for() {
    return this.control().id;
  }
}
