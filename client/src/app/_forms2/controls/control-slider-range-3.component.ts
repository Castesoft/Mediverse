import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, inject, model, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ValidationService } from "src/app/_services/validation.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { Ranges } from "src/app/_models/base/ranges";

@Component({
  selector: 'div[controlSliderRange3]',
  host: { },
  // template: ``,
  templateUrl: './control-slider-range-3.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MaterialModule, CdkModule,
   ],
})
export class ControlSliderRange3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<Ranges | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  min = signal<number>(0);
  max = signal<number>(1000);
  class = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {


      if (this.fromWrapper() === true) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      const min = this.control().ranges.min;
      const max = this.control().ranges.max;

      if (min !== null) this.min.set(min);
      if (max !== null) this.max.set(max);

      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

  updateMin(min: number) {
    const control = this.control();

    control.patchValue(new Ranges({ min, max: control.value?.max, }));

    this.control.set(control);
  }

  updateMax(max: number) {
    const control = this.control();

    control.patchValue(new Ranges({ min: control.value?.min, max, }));

    this.control.set(control);
  }

}
