import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { InputTypes } from '../_models/types';

@Component({
  selector: '[inputControl]',
  templateUrl: './form-control.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, PopoverModule, NgTemplateOutlet, ],
})
export class InputControlComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
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
