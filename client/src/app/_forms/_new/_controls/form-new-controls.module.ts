import { NgModule } from "@angular/core";
import { ControlCheckbox3Component } from "src/app/_forms/_new/_controls/control-checkbox-3.component";
import { ControlChipsRadio3Component } from "src/app/_forms/_new/_controls/control-chips-radio-3.component";
import { ControlDate3Component } from "src/app/_forms/_new/_controls/control-date-3.component";
import { ControlDateRange3Component } from "src/app/_forms/_new/_controls/control-date-range-3.component";
import { ControlFile3Component } from "src/app/_forms/_new/_controls/control-file-3.component";
import { ControlInput3Component } from "src/app/_forms/_new/_controls/control-input-3.component";
import { ControlRadio3Component } from "src/app/_forms/_new/_controls/control-radio-3.component";
import { ControlSearchText3Component } from "src/app/_forms/_new/_controls/control-search-text-3.component";
import { ControlSelect3Component } from "src/app/_forms/_new/_controls/control-select-3.component";
import { ControlSelectGroupComponent } from "src/app/_forms/_new/_controls/control-select-group.component";
import { ControlSelectMat3Component } from "src/app/_forms/_new/_controls/control-select-mat-3.component";
import { ControlSlide3Component } from "src/app/_forms/_new/_controls/control-slide-3.component";
import { ControlText3Component } from "src/app/_forms/_new/_controls/control-text-3.component";
import { ControlTextMat3Component } from "src/app/_forms/_new/_controls/control-text-mat-3.component";
import { ControlTextarea3Component } from "src/app/_forms/_new/_controls/control-textarea-3.component";
import { ControlTypeahead3Component } from "src/app/_forms/_new/_controls/control-typeahead-3.component";
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
    ControlTypeahead3Component,
    ControlRadio3Component,
    ControlSelectGroupComponent,
    ControlChipsRadio3Component,
    ControlCheckbox3Component,
    ControlFile3Component,
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
    ControlTypeahead3Component,
    ControlRadio3Component,
    ControlSelectGroupComponent,
    ControlChipsRadio3Component,
    ControlCheckbox3Component,
    ControlFile3Component,
  ],
})
export class FormNewControlsModule {}
