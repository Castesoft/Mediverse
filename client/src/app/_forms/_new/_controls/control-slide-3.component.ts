import { Component, effect, inject, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsService } from 'src/app/_services/forms.service';
import { SelectOption } from 'src/app/_forms/form';
import { CommonModule } from '@angular/common';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { FormControl2 } from 'src/app/_forms/form2';
import { InvalidFeedback3Component } from 'src/app/_forms/_new/_helper/invalid-feedback-3.component';
import { HelpBlock3Component } from 'src/app/_forms/_new/_helper/help-block-3.component';
import { OptionalSpan3Component } from 'src/app/_forms/_new/_helper/optional-span-3.component';
import { NewBadge3Component } from 'src/app/_forms/_new/_helper/new-badge-3.component';
import { ControlLabel3Component } from 'src/app/_forms/_new/_helper/control-label-3.component';
import { DateRange } from 'src/app/_models/types';

@Component({
  host: { class: 'fw-semibold mb-0 w-100 text-body' },
  selector: 'div[controlSlide3]',
  templateUrl: './control-slide-3.component.html',
  // template: ``,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InvalidFeedback3Component,
    HelpBlock3Component,
    OptionalSpan3Component,
    NewBadge3Component,
    ControlLabel3Component,
    CommonModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlSlide3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();

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
