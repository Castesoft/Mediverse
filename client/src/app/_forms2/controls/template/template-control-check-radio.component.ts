import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateInvalidFeedbackComponent } from 'src/app/_forms2/controls/template/template-invalid-feedback.component';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormControl2 } from 'src/app/_models/forms/formControl2';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  host: { class: 'fv-row mb-10 fv-plugins-icon-container', },
  selector: 'div[templateControlCheckRadio]',
  templateUrl: './template-control-check-radio.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, TemplateInvalidFeedbackComponent, ],
})
export class TemplateControlCheckRadioComponent {
validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  selected = output<SelectOption>();
  selectedValue = new SelectOption();

  constructor() {
    effect(() => {
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
