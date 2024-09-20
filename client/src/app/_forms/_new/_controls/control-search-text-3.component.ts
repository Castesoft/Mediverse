import { CommonModule } from '@angular/common';
import { Component, inject, model, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlInput3Component } from 'src/app/_forms/_new/_controls/control-input-3.component';
import { ControlLabel3Component } from 'src/app/_forms/_new/_helper/control-label-3.component';
import { HelpBlock3Component } from 'src/app/_forms/_new/_helper/help-block-3.component';
import { InvalidFeedback3Component } from 'src/app/_forms/_new/_helper/invalid-feedback-3.component';
import { NewBadge3Component } from 'src/app/_forms/_new/_helper/new-badge-3.component';
import { OptionalSpan3Component } from 'src/app/_forms/_new/_helper/optional-span-3.component';
import { SelectOption } from 'src/app/_forms/form';
import { FormControl2 } from 'src/app/_forms/form2';
import { DateRange } from 'src/app/_models/types';
import { FormsService } from 'src/app/_services/forms.service';
import { IconsService } from 'src/app/_services/icons.service';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';

@Component({
  host: { class: 'fw-semibold mb-0 w-100' },
  selector: '[controlSearchText3]',
  templateUrl: './control-search-text-3.component.html',
  // template: ``,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InvalidFeedback3Component,
    HelpBlock3Component,
    OptionalSpan3Component,
    NewBadge3Component,
    ControlLabel3Component,
    ControlInput3Component,
    CommonModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlSearchText3Component {
  service = inject(FormsService);
  icons = inject(IconsService);

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
