import { NgModule } from "@angular/core";
import { ControlLabel3Component } from "src/app/_forms/_new/_helper/control-label-3.component";
import { ErrorsAlert3Component } from "src/app/_forms/_new/_helper/errors-alert-3.component";
import { HelpBlock3Component } from "src/app/_forms/_new/_helper/help-block-3.component";
import { InvalidFeedback3Component } from "src/app/_forms/_new/_helper/invalid-feedback-3.component";
import { NewBadge3Component } from "src/app/_forms/_new/_helper/new-badge-3.component";
import { OptionalSpan3Component } from "src/app/_forms/_new/_helper/optional-span-3.component";
import { SubmitBtn3Component } from "src/app/_forms/_new/_helper/submit-btn-3.component";

@NgModule({
  imports: [
    HelpBlock3Component,
    InvalidFeedback3Component,
    NewBadge3Component,
    OptionalSpan3Component,
    SubmitBtn3Component,
    ControlLabel3Component,
    ErrorsAlert3Component,
  ],
  exports: [
    HelpBlock3Component,
    InvalidFeedback3Component,
    NewBadge3Component,
    OptionalSpan3Component,
    SubmitBtn3Component,
    ControlLabel3Component,
    ErrorsAlert3Component,
  ],
})
export class FormNewHelperModule {}
