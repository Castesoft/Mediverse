import { Component, computed, effect, inject, model, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormsService } from "src/app/_services/forms.service";
import { SelectOption } from "src/app/_forms/form";
import { Subject } from "rxjs";
import { FormControl2 } from "src/app/_forms/form2";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";

@Component({
  host: { class: "fw-semibold mb-0 w-100" },
  selector: "div[controlSelect3]",
  templateUrl: "./control-select-3.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormNewHelperModule,
    CommonModule,
    FormsModule,
  ]
})
export class ControlSelect3Component implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  service = inject(FormsService);
  control = model.required<FormControl2<SelectOption>>();
  validation = false;

  constructor() {
    effect(() => {
      this.subscribeToValidationMode();
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToValidationMode = (): void => {
    this.service.mode$.subscribe({
      next: validation =>
        this.control.set(this.control().setValidation(validation))
    });
  };

  optionChanged(option: string): void {
    const value: SelectOption = JSON.parse(option);
    const controlToUpdate = this.control();
    controlToUpdate.setValue(value);
    this.control.set(controlToUpdate);
  }
}
