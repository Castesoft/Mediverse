import { CommonModule } from "@angular/common";
import { Component, computed, input, model } from "@angular/core";
import { ControlsRow3Component } from "src/app/_forms/_new/_builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms/_new/_builder/controls-wrapper-3.component";
import { FormNewControlsModule } from "src/app/_forms/_new/_controls/form-new-controls.module";
import { ControlRows } from "src/app/_forms/form";
import { FormControl2 } from "src/app/_forms/form2";
import { ControlRadio3Component } from "src/app/_forms/_new/_controls/control-radio-3.component";

@Component({
  selector: "div[formBuilder3]",
  templateUrl: './form-builder-3.component.html',
  // template: ``,
  standalone: true,
  imports: [FormNewControlsModule, CommonModule, ControlsRow3Component, ControlsWrapper3Component, ControlRadio3Component]
})
export class FormBuilder3Component {
  controls = model.required<FormControl2<any>[]>();
  cols = input<ControlRows>("responsive");

  orientation = computed(() => this.controls()[0].orientation!);
}
