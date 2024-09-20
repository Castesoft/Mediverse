import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlCheckListComponent } from 'src/app/_forms/control-check-list.component';
import { ControlCheckRadioComponent } from 'src/app/_forms/control-check-radio.component';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { ControlDateComponent } from "src/app/_forms/control-date.component";
import { ControlMultiselectComponent } from 'src/app/_forms/control-multiselect.component';
import { ControlPasswordComponent } from 'src/app/_forms/control-password.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { ControlSwitchComponent } from 'src/app/_forms/control-switch.component';
import { ControlTextareaComponent } from 'src/app/_forms/control-textarea.component';
import { ControlTypeaheadComponent } from 'src/app/_forms/control-typeahead.component';
import { ControlsContainer, ControlsRowComponent, ControlsWrapperComponent, SubmitButtonComponent } from 'src/app/_forms/helpers/controls-wrapper.component';
import { ErrorsAlertComponent } from 'src/app/_forms/helpers/errors-alert.component';
import { FormBuilderComponent } from 'src/app/_forms/helpers/form-builder.component';
import { DetailFooterComponent, DetailHeaderComponent, FormHeaderComponent } from 'src/app/_forms/helpers/form-header.component';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { NewBadgeComponent } from 'src/app/_forms/helpers/new-badge.component';
import { OptionalSpanComponent } from 'src/app/_forms/helpers/optional-span.component';
import { SubmitBtnComponent } from 'src/app/_forms/helpers/submit-btn.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { SearchDateRangeComponent } from 'src/app/_forms/search-date-range.component';
import { SearchTextComponent } from 'src/app/_forms/search-text.component';
import { ControlTextComponent } from 'src/app/_forms/control-text.component';
import { ControlLabelComponent } from 'src/app/_forms/helpers/control-label.component';
import { ControlSlideComponent } from 'src/app/_forms/control-slide.component';
import { ControlDateRangeComponent } from 'src/app/_forms/control-date-range.component';
import { ControlSearchTextComponent } from 'src/app/_forms/control-search-text.component';
import { ControlSearchDateComponent } from 'src/app/_forms/control-search-date.component';
import { ControlCheck2Component } from 'src/app/_forms/control-check2.component';
import { ControlSelect2Component } from 'src/app/_forms/control-select-2.component';

@NgModule({
  imports: [
    InvalidFeedbackComponent,
    HelpBlockComponent,
    SubmitBtnComponent,
    OptionalSpanComponent,
    NewBadgeComponent,
    ControlCheckComponent,
    ControlCheck2Component,
    ControlCheckListComponent,
    ControlCheckRadioComponent,
    ControlDateComponent,
    ControlMultiselectComponent,
    ControlPasswordComponent,
    ControlSelectComponent,
    ControlSelect2Component,
    ControlSwitchComponent,
    ControlTextareaComponent,
    ControlTypeaheadComponent,
    InputControlComponent,
    SearchDateRangeComponent,
    SearchTextComponent,

    FormsModule,
    ReactiveFormsModule,
    ErrorsAlertComponent,
    ControlsWrapperComponent,
    ControlsRowComponent,
    ControlsContainer,
    SubmitButtonComponent,
    FormHeaderComponent,
    FormBuilderComponent,
    ControlTextComponent,
    DetailHeaderComponent,
    DetailFooterComponent,
    ControlLabelComponent,
    ControlSlideComponent,
    ControlDateRangeComponent,
    ControlSearchTextComponent,
    ControlSearchDateComponent,
  ],
  exports: [
    InvalidFeedbackComponent,
    HelpBlockComponent,
    SubmitBtnComponent,
    OptionalSpanComponent,
    NewBadgeComponent,
    ControlCheckComponent,
    ControlCheck2Component,
    ControlCheckListComponent,
    ControlCheckRadioComponent,
    ControlDateComponent,
    ControlMultiselectComponent,
    ControlPasswordComponent,
    ControlSelectComponent,
    ControlSelect2Component,
    ControlSwitchComponent,
    ControlTextareaComponent,
    ControlTypeaheadComponent,
    InputControlComponent,
    SearchDateRangeComponent,
    SearchTextComponent,

    FormsModule,
    ReactiveFormsModule,
    ErrorsAlertComponent,
    ControlsWrapperComponent,
    ControlsRowComponent,
    ControlsContainer,
    SubmitButtonComponent,
    FormHeaderComponent,
    FormBuilderComponent,
    ControlTextComponent,
    DetailHeaderComponent,
    DetailFooterComponent,
    ControlLabelComponent,
    ControlSlideComponent,
    ControlDateRangeComponent,
    ControlSearchTextComponent,
    ControlSearchDateComponent,
  ],
})
export class ControlsModule {}
