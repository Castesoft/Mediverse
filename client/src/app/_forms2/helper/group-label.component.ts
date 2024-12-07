import { Component, effect, HostBinding, inject, model } from '@angular/core';
import { OptionalSpan3Component } from 'src/app/_forms2/helper/optional-span-3.component';
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { SelectOptionPair } from "src/app/_models/base/selectOptionPair";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  selector: 'label[groupLabel]',
  templateUrl: './group-label.component.html',
  standalone: true,
  imports: [OptionalSpan3Component, ],
})
export class GroupLabelComponent {
  validation = inject(ValidationService);

  group = model.required<FormGroup2<SelectOptionPair>>();

  constructor() {
    effect(() => {

    })
  }

  @HostBinding('class') get class() {
    return this.group().orientation === 'inline' ? 'col-form-label fw-semibold fs-8 text-nowrap d-flex' : 'form-label fw-semibold fs-8';
  }

  @HostBinding('for') get for() {
    return this.group().id;
  }

}
