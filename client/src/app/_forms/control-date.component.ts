import { CommonModule } from "@angular/common";
import { Component, inject, Input, input, InputSignal, OnInit, Self } from "@angular/core";
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  selector: '[controlDate]',
  templateUrl: './control-date.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HelpBlockComponent,
    InvalidFeedbackComponent,
    FlatpickrDirective,
  ],
})
export class ControlDateComponent implements ControlValueAccessor, OnInit {
  validation: ValidationService = inject(ValidationService);

  errors: InputSignal<{ [key: string]: string }> = input({});
  formText: InputSignal<string | null> = input(null as string | null);
  solid: InputSignal<boolean> = input(false);
  submitted: InputSignal<boolean> = input(false);
  autofocus: InputSignal<boolean> = input(false);
  isNew: InputSignal<boolean> = input(false);
  optional: InputSignal<boolean> = input(false);
  timepicker: InputSignal<boolean> = input(false);

  @Input() id?: string;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxDate: Date | undefined;
  @Input() isReadonly: boolean = false;
  @Input() hideIsOptional: boolean = false;
  @Input() minMode: 'day' | 'month' | 'year' = 'day';
  @Input() popoverText?: string;
  @Input() popoverTitle?: string;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.isReadonly && this.ngControl.control) {
      if (this.popoverText === undefined) this.popoverText = this.ngControl.control!.value;
      if (this.popoverTitle === undefined) this.popoverTitle = this.label;
    }
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.control.setValue(null);
    }
  }
}
