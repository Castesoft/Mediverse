import { DatePipe, CommonModule } from "@angular/common";
import { Component, OnDestroy, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Control } from "src/app/_models/forms/deprecated/control";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  host: { class: "fw-semibold mb-0 w-100" },
  selector: "div[controlSelect2]",
  templateUrl: "./control-select-2.component.html",
  standalone: true,
  providers: [DatePipe],
  imports: [
    ReactiveFormsModule,
    InvalidFeedbackComponent,
    HelpBlockComponent,
    OptionalSpanComponent,
    NewBadgeComponent,
    CommonModule,
    FormsModule,
  ]
})
export class ControlSelect2Component implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  validation = inject(ValidationService);
  control = model.required<Control<SelectOption>>();

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  optionChanged(option: string): void {
    const value: SelectOption = JSON.parse(option);
    const updatedControl = this.control().setValue(value);
    this.control.set(updatedControl);
  }
}
