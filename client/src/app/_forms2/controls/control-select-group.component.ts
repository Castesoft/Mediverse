import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GroupHelpBlockComponent } from "src/app/_forms2/helper/group-help-block.component";
import { GroupLabelComponent } from "src/app/_forms2/helper/group-label.component";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { SelectOptionPair } from "src/app/_models/base/selectOptionPair";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "[controlSelectGroup]",
  templateUrl: "./control-select-group.component.html",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GroupLabelComponent,
    MaterialModule,
    CdkModule,
    CommonModule,
    GroupHelpBlockComponent
  ]
})
export class ControlSelectGroupComponent {
  group = model.required<FormGroup2<SelectOptionPair>>();

  root = computed<FormGroup2<any>>(() => {
    return this.group().root as FormGroup2<any>;
  });

  fromWrapper = model.required<boolean>();

  class = "fw-semibold mb-0";

  @HostBinding("class") get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper() === true) {
        this.class += " w-100";
      } else {
        this.class += " col-auto px-0";
      }
    });
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
