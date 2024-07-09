import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, Self, ViewChild, inject, input, viewChild } from '@angular/core';
import Choices from 'choices.js';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MultiselectOption } from 'src/app/_models/types';
import { FormsService } from 'src/app/_services/forms.service';

@Component({
  selector: '[controlMultiselect]',
  templateUrl: './control-multiselect.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule ],
})
export class ControlMultiselectComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  service = inject(FormsService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  autofocus = input<boolean>(false);
  options = input.required<MultiselectOption[]>();
  id = input.required<string>();
  formText = input<string | undefined>();
  label = input.required<string>();
  optional = input<boolean>(false);

  multiSelect = viewChild.required<ElementRef>('multiSelect');

  private onChange: (value: string) => void = (value: string) => {};
  private onTouched: () => void = () => { };
  isDisabled= false;
  private previousValueLength: number = 0;

  constructor(@Self() public ngControl: NgControl ) {
    this.ngControl.valueAccessor = this;
  }
  ngAfterViewInit(): void {
    this.choice = new Choices(this.multiSelect().nativeElement, {
      removeItemButton: true,
      placeholder: true,
      itemSelectText: '',
      allowHTML: true,
    });
  }
  ngOnInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('input');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }
  }

  choice: Choices | null = null;

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
