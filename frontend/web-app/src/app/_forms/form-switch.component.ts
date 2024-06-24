import { AfterViewInit, Component, ElementRef, Input, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { NgClass, KeyValuePipe } from '@angular/common';
import { isControlOptional } from '../_utils/util';

@Component({
  selector: '[controlSwitch]',
  templateUrl: './form-switch.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, ],
})
export class ControlSwitchComponent implements ControlValueAccessor, AfterViewInit {
  @Input() id?: string;
  @Input() label: string = '';
  @Input() formText?: string;
  @Input() isReadonly: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() shouldAutoFocus: boolean = false;
  @Input() isOptional: boolean = false;

  private onChange = (value: any) => { };

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

  writeValue(obj: any): void {
    if (obj !== this.control.value) {
      this.control.setValue(obj, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isReadonly = isDisabled;

    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    const formGroup = this.control?.parent as FormGroup;
    let name = 'defaultName';

    if (formGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        if (this.control === formGroup.controls[key]) {
          name = key;
        }
      });
    }

    return name;
  }


  onTouched = () => { };

  ngOnInit() {
    this.control.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.onChange(value);
      });
  }
}
