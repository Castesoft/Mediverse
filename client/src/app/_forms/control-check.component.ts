import { Component, ElementRef, inject, input, Input, InputSignal, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: 'div[controlCheck]',
  templateUrl: './control-check.component.html',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, HelpBlockComponent, InvalidFeedbackComponent, ],
})
export class ControlCheckComponent implements ControlValueAccessor {
  readonly validation: ValidationService = inject(ValidationService);

  errors: InputSignal<{ [key: string]: string }> = input({});
  formText: InputSignal<string | null> = input(null as string | null);
  submitted: InputSignal<boolean> = input(false);
  solid: InputSignal<boolean> = input(false);

  @Input() id?: string;
  @Input() label?: string;
  autofocus = input<boolean>(false);

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }

  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }
}
