import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  effect,
  ElementRef, HostBinding,
  inject, input, InputSignal,
  model,
  ModelSignal,
  Signal
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
  selector: 'div[templateControlCheckbox]',
  templateUrl: './template-control-checkbox.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, TemplateInvalidFeedbackComponent, ],
})
export class TemplateControlCheckboxComponent {
  validation: ValidationService = inject(ValidationService);

  customLabel: Signal<ElementRef | undefined> = contentChild<ElementRef>('customLabel');

  control: ModelSignal<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>> = model.required();
  showBottomMargin: InputSignal<boolean> = input(true);
  fromWrapper: ModelSignal<boolean> = model.required();
  root: Signal<FormGroup2<any>> = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  class: string = "fv-row fv-plugins-icon-container";

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));

      if (this.showBottomMargin()) {
        this.class += ` mb-10`;
      }

      console.log('templateControlCheckbox class:', this.class);
    });
  }
}
