import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect, HostBinding,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  output, OutputEmitterRef,
  Signal
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TemplateInvalidFeedbackComponent
} from 'src/app/_forms2/controls/template/template-invalid-feedback.component';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormControl2 } from 'src/app/_models/forms/formControl2';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { ValidationService } from 'src/app/_services/validation.service';
import { OptionalSpan3Component } from "src/app/_forms2/helper/optional-span-3.component";
import { NewBadge3Component } from "src/app/_forms2/helper/new-badge-3.component";

@Component({
  selector: 'div[templateControlCheckRadio]',
  templateUrl: './template-control-check-radio.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, TemplateInvalidFeedbackComponent, OptionalSpan3Component, NewBadge3Component, ],
})
export class TemplateControlCheckRadioComponent {
  readonly validation: ValidationService = inject(ValidationService);

  control: ModelSignal<FormControl2<string | number | boolean | Date | SelectOption | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required();
  root: Signal<FormGroup2<any>> = computed(() => { return this.control().root as FormGroup2<any>; });

  // Show bottom margins (mb-10)
  showBottomMargin: InputSignal<boolean> = input(true);

  selected: OutputEmitterRef<SelectOption> = output();
  selectedValue: SelectOption = new SelectOption();

  class: string = "fv-row fv-plugins-icon-container fw-semibold mb-0";

  @HostBinding("class") get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));

      if (this.showBottomMargin()) {
        this.class += ` mb-10`;
      }
    });
  }

  handleValueChange(option: SelectOption): void {
    const selected: SelectOption | undefined = this.control().selectOptions.find((o: SelectOption) => o === option);
    if (selected && this.selectedValue.name !== selected.name) {
      this.selectedValue = selected;
      this.selected.emit(selected);

      this.control().markAsDirty();
      this.control()?.setValue(selected, { emitEvent: true });
      this.control.set(this.control());
    }
  };
}
