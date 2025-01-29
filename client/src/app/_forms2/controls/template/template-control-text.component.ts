import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  HostBinding,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal, Signal
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TemplateInvalidFeedbackComponent
} from 'src/app/_forms2/controls/template/template-invalid-feedback.component';
import { DateRange } from 'src/app/_models/base/dateRange';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormControl2 } from 'src/app/_models/forms/formControl2';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: 'div[templateControlText]',
  templateUrl: './template-control-text.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, TemplateInvalidFeedbackComponent, ],
})
export class TemplateControlTextComponent {
  validation: ValidationService = inject(ValidationService);

  control: ModelSignal<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required();

  root: Signal<FormGroup2<any>> = computed(() => this.control().root as FormGroup2<any>);

  // Show bottom margins (mb-10)
  showBottomMargin: InputSignal<boolean> = input(true);

  class = 'fv-row fv-plugins-icon-container';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));

      if (this.fromWrapper()) {
        this.class = `${this.class} w-100`;
      }

      if (this.showBottomMargin()) {
        this.class += ` mb-10`;
      }
    });
  }
}
