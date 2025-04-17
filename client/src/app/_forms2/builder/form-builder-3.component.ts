import { CommonModule } from "@angular/common";
import { Component, computed, effect, input, model } from "@angular/core";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { ControlRows } from "src/app/_models/forms/formTypes";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

@Component({
  selector: "div[formBuilder3]",
  templateUrl: "./form-builder-3.component.html",
  standalone: true,
  host: { class: 'mb-1', },
  imports: [ CommonModule, ControlsRow3Component, ControlsWrapper3Component, ]
})
export class FormBuilder3Component {
  controls = model.required<FormControl2<any>[]>();
  cols = input<ControlRows>("responsive");
  accept = input<string>(''); // Added accept input signal

  gap = input<any>();

  orientation = computed(() => (this.controls()[0].root as FormGroup2<any>).orientation!);

  constructor() {
    effect(() => {

    })
  }
}
