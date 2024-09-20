import { NgModule } from "@angular/core";
import { ControlDate3Component } from "src/app/_forms/_new/_controls/control-date-3.component";
import { ControlDateRange3Component } from "src/app/_forms/_new/_controls/control-date-range-3.component";
import { ControlInput3Component } from "src/app/_forms/_new/_controls/control-input-3.component";
import { ControlSearchText3Component } from "src/app/_forms/_new/_controls/control-search-text-3.component";
import { ControlSelect3Component } from "src/app/_forms/_new/_controls/control-select-3.component";
import { ControlSelectMat3Component } from "src/app/_forms/_new/_controls/control-select-mat-3.component";
import { ControlSlide3Component } from "src/app/_forms/_new/_controls/control-slide-3.component";
import { ControlText3Component } from "src/app/_forms/_new/_controls/control-text-3.component";
import { ControlTextMat3Component } from "src/app/_forms/_new/_controls/control-text-mat-3.component";
import { ControlTextarea3Component } from "src/app/_forms/_new/_controls/control-textarea-3.component";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";

@NgModule({
  imports: [
    FormNewHelperModule,
    ControlSelect3Component,
    ControlText3Component,
    ControlTextarea3Component,
    ControlInput3Component,
    ControlDate3Component,
    ControlSlide3Component,
    ControlSearchText3Component,
    ControlDateRange3Component,
    ControlSelectMat3Component,
    ControlTextMat3Component,
  ],
  exports: [
    FormNewHelperModule,
    ControlSelect3Component,
    ControlText3Component,
    ControlTextarea3Component,
    ControlInput3Component,
    ControlDate3Component,
    ControlSlide3Component,
    ControlSearchText3Component,
    ControlDateRange3Component,
    ControlSelectMat3Component,
    ControlTextMat3Component,
  ],
})
export class FormNewControlsModule {}
