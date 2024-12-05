import { Component, computed, effect, HostBinding, inject, model, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Subject } from "rxjs";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";

@Component({
  selector: "div[controlSelect3]",
  templateUrl: "./control-select-3.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MaterialModule, CdkModule,
  ]
})
export class ControlSelect3Component implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  validation = inject(ValidationService);
  control = model.required<FormControl2<SelectOption | null>>();
  fromWrapper = model.required<boolean>();  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

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

      // this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  optionChanged(option: string | null): void {
    const controlToUpdate = this.control();
    if (option === null) {
      controlToUpdate.patchValue(null, { emitEvent: true, });
    } else {
      const value: SelectOption = JSON.parse(option);
      controlToUpdate.patchValue(value, { emitEvent: true, });
    }
    controlToUpdate.markAsDirty();
    const controlToSet = new FormControl2<SelectOption | null>(controlToUpdate);
    controlToSet.setParent(controlToUpdate.parent);
    controlToSet.type = controlToUpdate.type;
    controlToSet.selectOptions = controlToUpdate.selectOptions;
    controlToSet.showCodeSpan = controlToUpdate.showCodeSpan;
    controlToSet.showLabel = controlToUpdate.showLabel;
    controlToSet.label = controlToUpdate.label;
    
    if (option !== null) {
      controlToSet.patchValue(JSON.parse(option));
      this.control.set(controlToSet);
    }
  }
}
