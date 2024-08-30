import { Component, effect, inject, model, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { FormsService } from "src/app/_services/forms.service";
import { Subject } from "rxjs";
import { Control, SelectOption } from "src/app/_forms/form";

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

  service = inject(FormsService);
  control = model.required<Control<SelectOption>>();
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
    const updatedControl = this.control().setValue(value);
    this.control.set(updatedControl);
  }
}
