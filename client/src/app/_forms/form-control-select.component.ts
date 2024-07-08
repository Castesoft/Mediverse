import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { isControlOptional } from '../../utils/util';
import { NgClass, KeyValuePipe } from '@angular/common';

@Component({
  selector: '[controlSelect]',
  templateUrl: './form-control-select.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, ],
})
export class ControlSelectComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() id?: string;
  @Input() formText?: string;
  @Input() isOptional: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() hideIsOptional: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() shouldAutoFocus: boolean = false;
  @Input() options: any[] = [];



  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    if (this.shouldAutoFocus) {
      const inputEl = this.el.nativeElement.querySelector('select');
      this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
      inputEl.focus();
    }

    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.options = changes['options'].currentValue;
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
