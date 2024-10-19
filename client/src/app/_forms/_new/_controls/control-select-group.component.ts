import { CommonModule } from "@angular/common";
import { Component, computed, effect, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GroupHelpBlockComponent } from "src/app/_forms/_new/_helper/group-help-block.component";
import { GroupLabelComponent } from "src/app/_forms/_new/_helper/group-label.component";
import { HelpBlock3Component } from "src/app/_forms/_new/_helper/help-block-3.component";
import { InvalidFeedback3Component } from "src/app/_forms/_new/_helper/invalid-feedback-3.component";
import { SelectOption } from "src/app/_forms/form";
import { FormGroup2 } from "src/app/_forms/form2";
import { SelectOptionPair } from "src/app/_models/select-option-pair";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: '[controlSelectGroup]',
  templateUrl: './control-select-group.component.html',
  host: { class: "fw-semibold mb-0 w-100" },
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, GroupLabelComponent, MaterialModule, CdkModule, CommonModule, InvalidFeedback3Component, GroupHelpBlockComponent, HelpBlock3Component, ],
})
export class ControlSelectGroupComponent {
  group = model.required<FormGroup2<SelectOptionPair>>();

  root = computed<FormGroup2<any>>(() => {
    return this.group().root as FormGroup2<any>;
  });

  constructor() {
    effect(() => {

    })
  }

  optionChangedFirst(option: string): void {
    const value: SelectOption = JSON.parse(option);
    const groupToUpdate = this.group();
    groupToUpdate.controls.first.setValue(value);
    groupToUpdate.markAsDirty();
    this.group.set(groupToUpdate);
  }

  optionChangedSecond(option: string): void {
    const value: SelectOption = JSON.parse(option);
    const groupToUpdate = this.group();
    groupToUpdate.controls.second.setValue(value);
    groupToUpdate.markAsDirty();
    this.group.set(groupToUpdate);
  }
}
