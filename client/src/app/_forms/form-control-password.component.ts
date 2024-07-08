import { Component, AfterViewInit, Input, Self, Renderer2, ElementRef } from "@angular/core";
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from "@angular/forms";
import { KeyValuePipe, NgClass } from "@angular/common";
import { isControlOptional } from "../_utils/util";

@Component({
  selector: '[controlPassword]',
  templateUrl: './form-control-password.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, ],
})
export class FormControlPasswordComponent implements ControlValueAccessor, AfterViewInit {
  @Input() id?: string;
  @Input() label: string = '';
  @Input() formText?: string;
  @Input() placeholder: string = '';
  @Input() shouldAutoFocus: boolean = false;
  @Input() isOptional: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};


  showPassword = false;

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

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }
}
