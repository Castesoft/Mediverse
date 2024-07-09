import { Component, AfterViewInit, Input, Self, Renderer2, ElementRef, input, inject } from "@angular/core";
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from "@angular/forms";
import { KeyValuePipe, NgClass } from "@angular/common";
import { FormsService } from "src/app/_services/forms.service";

@Component({
  selector: '[controlPassword]',
  templateUrl: './control-password.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, ],
})
export class ControlPasswordComponent implements ControlValueAccessor, AfterViewInit {
  service = inject(FormsService);

  autofocus = input<boolean>(false);

  @Input() id?: string;
  @Input() label: string = '';
  @Input() formText?: string;
  @Input() placeholder: string = '';
  @Input() submitted= false;
  @Input() errors: { [key: string]: string } = {};


  showPassword = false;

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }
  ngAfterViewInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('input');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }
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
