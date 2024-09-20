import { NgModule } from "@angular/core";
import { FormNewBuilderModule } from "src/app/_forms/_new/_builder/form-new-builder.module";
import { FormNewControlsModule } from "src/app/_forms/_new/_controls/form-new-controls.module";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";

@NgModule({
  imports: [
    FormNewBuilderModule,
    FormNewControlsModule,
    FormNewHelperModule,
  ],
  exports: [
    FormNewBuilderModule,
    FormNewControlsModule,
    FormNewHelperModule,
  ],
})
export class FormNewModule {}
