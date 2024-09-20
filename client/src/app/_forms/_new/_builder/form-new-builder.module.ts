import { NgModule } from "@angular/core";
import { ControlsContainer3Component } from "src/app/_forms/_new/_builder/controls-container-3.component";
import { ControlsRow3Component } from "src/app/_forms/_new/_builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms/_new/_builder/controls-wrapper-3.component";
import { FormBuilder3Component } from "src/app/_forms/_new/_builder/form-builder-3.component";

@NgModule({
  imports: [
    ControlsContainer3Component,
    ControlsRow3Component,
    ControlsWrapper3Component,
    FormBuilder3Component,
  ],
  exports: [
    ControlsContainer3Component,
    ControlsRow3Component,
    ControlsWrapper3Component,
    FormBuilder3Component,
  ],
})
export class FormNewBuilderModule {}
