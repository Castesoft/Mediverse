import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostBinding, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateInvalidFeedbackComponent } from 'src/app/_forms2/controls/template/template-invalid-feedback.component';
import { DateRange } from 'src/app/_models/base/dateRange';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormControl2 } from 'src/app/_models/forms/formControl2';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: 'div[templateControlTextarea]',
  templateUrl: './template-control-textarea.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, TemplateInvalidFeedbackComponent, ],
})
export class TemplateControlTextareaComponent {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  class = 'fv-row mb-10 fv-plugins-icon-container';

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));

      if (this.fromWrapper() === true) {
        this.class = `${this.class} w-100`;
      }
    });
  }

  @HostBinding('class') get hostClass() {
    return this.class;
  }

}
