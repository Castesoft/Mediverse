import { AfterViewInit, Component, ElementRef, Input, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { isControlOptional } from '../../utils/util';
import { NgClass, KeyValuePipe, NgStyle } from '@angular/common';

@Component({
  selector: '[controlTextarea]',
  templateUrl: './form-control-textarea.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, NgStyle, ],
  styles: `
.invalid-feedback.show-feedback {
  display: block !important;
}

.invalid-feedback {
  display: block !important;
}

.form-label {
  display: flex;
  align-items: center;
  padding-bottom: -20px !important;
}`
})
export class ControlTextareaComponent implements ControlValueAccessor, AfterViewInit {
  @Input() id?: string;
  @Input() label: string = '';
  @Input() formText?: string;
  @Input() isReadonly: boolean = false;
  @Input() isOptional: boolean = false;
  @Input() shouldAutoFocus: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() hideIsOptional: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() fill: boolean = false;

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    if (this.shouldAutoFocus) {
      const inputEl = this.el.nativeElement.querySelector('textarea');
      this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
      inputEl.focus();
    }

    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
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
}
