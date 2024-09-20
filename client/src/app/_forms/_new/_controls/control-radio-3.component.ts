import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, model, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsService } from "src/app/_services/forms.service";
import { SelectOption } from "src/app/_forms/form";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";

@Component({
  host: { class: "fw-semibold mb-0 w-100" },
  selector: "div[controlRadio3]",
  templateUrl: "./control-radio-3.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormNewHelperModule, OptionalSpanComponent, NewBadgeComponent]
})
export class ControlRadio3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | number | boolean | Date | SelectOption | null>>();
  parent = computed<FormGroup2<any>>(() => {
    return this.control().parent as FormGroup2<any>;
  });

  selected = output<SelectOption>();

  validation = false;

  selectedValue = new SelectOption();

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    });
  }

  handleValueChange(option: SelectOption): void {
    const selected = this.control().selectOptions.find(o => o === option);
    if (selected && this.selectedValue.name !== selected.name) {
      this.selectedValue = selected;
      this.selected.emit(selected);
      const control = this.control();
      control?.setValue(selected, { emitEvent: true });
      this.control.set(control);
    }
  };
}
