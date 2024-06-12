import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { InputTypes } from '../models/types';

@Component({
  selector: '[control]',
  templateUrl: './form-control.component.html'
})
export class FormControlComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @Input() id?: string;
  @Input() formText?: string;
  @Input() label: string = '';
  @Input() type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() datalistOptions?: any[] | null = null;
  @Input() isReadonly: boolean = false;
  @Input() isOptional: boolean = false;
  @Input() hideIsOptional: boolean = false;
  @Input() shouldAutoFocus: boolean = false;
  @Input() submitted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() isPending?: boolean = false;
  @Input() validationMode = false;
  @Input() role = 'presentation';
  @Input() spellcheck = false;
  @Input() autocomplete = 'disabled';

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  get control(): FormControl { return this.ngControl.control as FormControl }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName' }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2,
    private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const validationMode = changes['validationMode']?.currentValue as boolean;

    if (validationMode && this.ngControl.control) {
      this.control.updateValueAndValidity();
    }
  }

  ngAfterViewInit(): void {
    if (this.shouldAutoFocus) {
      const inputEl = this.el.nativeElement.querySelector('input');
      this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
      inputEl.focus();
    }
  }
}
