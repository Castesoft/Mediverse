import { AfterViewInit, Component, ElementRef, Input, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { isControlOptional } from '../../utils/util';
import { KeyValuePipe, NgClass } from '@angular/common';

@Component({
  selector: '[controlCheck]',
  templateUrl: './form-check.component.html',
  standalone: true,
  imports: [ KeyValuePipe, NgClass, ReactiveFormsModule ],
})
export class FormCheckComponent implements ControlValueAccessor, AfterViewInit {
  @Input() id?: string;
  @Input() label?: string;
  @Input() formText?: string;
  @Input() submitAttempted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() shouldAutoFocus: boolean = false;
  @Input() isOptional: boolean = false;

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    if (this.shouldAutoFocus) {
      const inputEl = this.el.nativeElement.querySelector('input');
      this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
      inputEl.focus();
    }

    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
    }
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
