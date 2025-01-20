import {
  Component,
  computed,
  effect,
  HostBinding,
  inject, input,
  InputSignal, model, ModelSignal,
  OnDestroy, Signal,
} from "@angular/core";
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

/**
 * This component uses an optional @Input() useMaterial to switch
 * between a <mat-select> and a normal <select>.
 *
 * The form control is updated on every change, so form values
 * properly reflect the latest selection.
 */
@Component({
  selector: "div[controlSelect3]",
  templateUrl: "./control-select-3.component.html",
  styleUrls: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MaterialModule,
    CdkModule,
  ],
})
export class ControlSelect3Component implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  validation: ValidationService = inject(ValidationService);
  control: ModelSignal<FormControl2<SelectOption | null>> = model.required<FormControl2<SelectOption | null>>();
  fromWrapper: ModelSignal<boolean> = model.required<boolean>();

  useMaterial: InputSignal<boolean> = input(false);

  root: Signal<FormGroup2<any>> = computed<FormGroup2<any>>(() => this.control().root as FormGroup2<any>);

  class: string = "mb-0";

  @HostBinding("class") get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper()) {
        this.class = "mb-0 w-100";
      } else {
        this.class = "mb-0 col-auto px-0";
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * optionChanged will be called by either:
   * 1) mat-select (which passes the raw object in $event.value)
   * 2) a normal <select> (which passes an Event that must be parsed).
   */
  optionChanged(option: SelectOption | string | Event | null): void {
    let parsedValue: SelectOption | null = null;

    // If it's an Event from a <select>, parse out the JSON string
    if (option instanceof Event) {
      const selectElement = option.target as HTMLSelectElement;
      const selectedValue = selectElement.value;
      if (selectedValue && selectedValue !== "null") {
        parsedValue = JSON.parse(selectedValue);
      }
    }
    // If it's a string (from e.g. Material or direct binding), we assume it's JSON unless it's "null".
    else if (typeof option === "string") {
      if (option !== "null") {
        parsedValue = JSON.parse(option);
      }
    }

    // If it's an actual SelectOption object
    else if (option && typeof option === "object") {
      parsedValue = option;
    }

    this.control().patchValue(parsedValue, { emitEvent: true });
    this.control().markAsDirty();
  }
}
