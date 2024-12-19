import { NgModule } from "@angular/core";
import { ControlButtonToggleMultiple3Component } from "src/app/_forms2/controls/control-button-toggle-multiple-3.component";
import { ControlCheckbox3Component } from "src/app/_forms2/controls/control-checkbox-3.component";
import { ControlChipsRadio3Component } from "src/app/_forms2/controls/control-chips-radio-3.component";
import { ControlDate3Component } from "src/app/_forms2/controls/control-date-3.component";
import { ControlDateRange3Component } from "src/app/_forms2/controls/control-date-range-3.component";
import { ControlFile3Component } from "src/app/_forms2/controls/control-file-3.component";
import { ControlFileImage3Componnent } from "src/app/_forms2/controls/control-file-image-3.component";
import { ControlFiles3Component } from "src/app/_forms2/controls/control-files-3.component";
import { ControlInput3Component } from "src/app/_forms2/controls/control-input-3.component";
import { ControlMultiselect3Component } from "src/app/_forms2/controls/control-multiselect-3.component";
import { ControlPassword3Component } from "src/app/_forms2/controls/control-password-3.component";
import { ControlRadio3Component } from "src/app/_forms2/controls/control-radio-3.component";
import { ControlSearchText3Component } from "src/app/_forms2/controls/control-search-text-3.component";
import { ControlSelect3Component } from "src/app/_forms2/controls/control-select-3.component";
import { ControlSelectGroupComponent } from "src/app/_forms2/controls/control-select-group.component";
import { ControlSlide3Component } from "src/app/_forms2/controls/control-slide-3.component";
import { ControlSliderRange3Component } from "src/app/_forms2/controls/control-slider-range-3.component";
import { ControlText3Component } from "src/app/_forms2/controls/control-text-3.component";
import { ControlTextarea3Component } from "src/app/_forms2/controls/control-textarea-3.component";
import { ControlTime3Component } from 'src/app/_forms2/controls/control-time-3.component';
import { ControlTypeahead3Component } from "src/app/_forms2/controls/control-typeahead-3.component";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";

@NgModule({
  imports: [
    Forms2HelperModule,
    ControlSelect3Component,
    ControlText3Component,
    ControlTextarea3Component,
    ControlInput3Component,
    ControlDate3Component,
    ControlTime3Component,
    ControlSlide3Component,
    ControlSearchText3Component,
    ControlDateRange3Component,
    ControlTypeahead3Component,
    ControlRadio3Component,
    ControlSelectGroupComponent,
    ControlChipsRadio3Component,
    ControlCheckbox3Component,
    ControlFile3Component,
    ControlMultiselect3Component,
    ControlButtonToggleMultiple3Component,
    ControlSliderRange3Component,
    ControlPassword3Component,
    ControlFileImage3Componnent,
    ControlFiles3Component,
  ],
  exports: [
    Forms2HelperModule,
    ControlSelect3Component,
    ControlText3Component,
    ControlTextarea3Component,
    ControlInput3Component,
    ControlDate3Component,
    ControlTime3Component,
    ControlSlide3Component,
    ControlSearchText3Component,
    ControlDateRange3Component,
    ControlTypeahead3Component,
    ControlRadio3Component,
    ControlSelectGroupComponent,
    ControlChipsRadio3Component,
    ControlCheckbox3Component,
    ControlFile3Component,
    ControlMultiselect3Component,
    ControlButtonToggleMultiple3Component,
    ControlSliderRange3Component,
    ControlPassword3Component,
    ControlFileImage3Componnent,
    ControlFiles3Component,
  ],
})
export class Forms2ControlsModule {}
