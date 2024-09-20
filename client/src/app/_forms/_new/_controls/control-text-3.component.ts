import { Component, computed, effect, inject, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsService } from 'src/app/_services/forms.service';
import { SelectOption } from 'src/app/_forms/form';
import { CommonModule } from '@angular/common';
import { FormControl2, FormGroup2 } from 'src/app/_forms/form2';
import { FormNewHelperModule } from 'src/app/_forms/_new/_helper/form-new-helper.module';
import { ControlInput3Component } from 'src/app/_forms/_new/_controls/control-input-3.component';
import { DateRange } from 'src/app/_models/types';

@Component({
  host: { class: 'fw-semibold mb-0 w-100' },
  selector: 'div[controlText3]',
  templateUrl: './control-text-3.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormNewHelperModule,
    CommonModule,
    ControlInput3Component,
  ],
})
export class ControlText3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  validation = false;

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({
        next: (validation) =>
          this.control.set(this.control().setValidation(validation)),
      });
    });
  }
}
