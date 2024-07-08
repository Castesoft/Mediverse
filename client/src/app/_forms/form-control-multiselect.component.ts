import { AfterViewInit, Component, ElementRef, Input, Self, ViewChild } from '@angular/core';
import Choices from 'choices.js';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MultiselectOption } from '../_models/types';

@Component({
  selector: '[controlMultiselect]',
  templateUrl: './form-control-multiselect.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule ],
})
export class ControlMultiselectComponent implements ControlValueAccessor, AfterViewInit {
  @Input({ required: true }) options: MultiselectOption[] = [];
  @Input({ required: true }) id: string = '';
  @Input() formText?: string;
  @Input() label: string = '';
  @Input() shouldAutoFocus = false;

  @ViewChild('multiSelect') multiSelect!: ElementRef;

  private onChange: (value: string) => void = (value: string) => { console.log(value); };
  private onTouched: () => void = () => { };
  isDisabled: boolean = false;
  private previousValueLength: number = 0;

  constructor(@Self() public ngControl: NgControl, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  choice: Choices | null = null;

  ngAfterViewInit(): void {
    if (this.shouldAutoFocus) {
      const inputEl = this.el.nativeElement.querySelector('input');
      inputEl?.focus();
    }

    this.choice = new Choices(this.multiSelect.nativeElement, {
      removeItemButton: true,
      placeholder: true,
      itemSelectText: '',
      allowHTML: true,
    });
  }

  writeValue(value: any): void {
    if (this.control) {
      const currentValueLength = value ? value.length : 0;

      if (this.previousValueLength !== 0 && currentValueLength === 0) {
        this.choice?.removeActiveItems(0);
      } else if (value !== this.control.value) {
        if (!value) {
          this.choice?.removeActiveItems(0);
        } else {
          this.onChange(value);
        }
      }

      this.previousValueLength = currentValueLength;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;

    if (this.choice) {
      if (this.isDisabled) {
        this.choice.disable();
      } else {
        this.choice.enable();
      }
    }
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }
}
