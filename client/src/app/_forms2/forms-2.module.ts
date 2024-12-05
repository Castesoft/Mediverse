import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Forms2BuilderModule } from "src/app/_forms2/builder/forms-2-builder.module";
import { Forms2ControlsModule } from "src/app/_forms2/controls/forms-2-controls.module";
import { Forms2DetailModule } from "src/app/_forms2/detail/forms-2-detail.module";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";

@NgModule({
  imports: [
    Forms2BuilderModule,
    Forms2ControlsModule,
    Forms2HelperModule,
    ReactiveFormsModule,
    Forms2DetailModule,
    FormsModule,
  ],
  exports: [
    Forms2BuilderModule,
    Forms2ControlsModule,
    Forms2HelperModule,
    ReactiveFormsModule,
    Forms2DetailModule,
    FormsModule,
  ],
})
export class Forms2Module {}
