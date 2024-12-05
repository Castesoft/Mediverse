import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, inject, model, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "div[controlRadio3]",
  templateUrl: "./control-radio-3.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Forms2HelperModule, MaterialModule, ]
})
export class ControlRadio3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  selected = output<SelectOption>();
  selectedValue = new SelectOption();

  class = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper() === true) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

  handleValueChange(option: SelectOption): void {
    const selected = this.control().selectOptions.find(o => o === option);
    if (selected && this.selectedValue.name !== selected.name) {
      this.selectedValue = selected;
      this.selected.emit(selected);

      this.control().markAsDirty();
      this.control()?.setValue(selected, { emitEvent: true });
      this.control.set(this.control());
    }
  };
}
