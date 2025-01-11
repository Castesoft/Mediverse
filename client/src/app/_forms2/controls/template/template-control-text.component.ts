import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostBinding, inject, input, model } from '@angular/core';
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
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  // Show bottom margins (mb-10)
  showBottomMargin = input<boolean>(true);

  class = 'fv-row fv-plugins-icon-container';

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

  @HostBinding('class') get hostClass() {
    return this.class;
  }

}
