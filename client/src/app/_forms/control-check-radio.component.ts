import { Component, Injector, OnInit, forwardRef, inject, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: '[controlCheckRadio]',
  templateUrl: './control-check-radio.component.html',
  standalone: true,
  imports: [CommonModule, HelpBlockComponent, InvalidFeedbackComponent],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ControlCheckRadioComponent),
    multi: true,
  }]
})
export class ControlCheckRadioComponent implements ControlValueAccessor, OnInit {
  validation = inject(ValidationService);

  autofocus = input<boolean>(false);
  id = input<string>();
  label = input.required<string | undefined>();
  formText = input<string | null>(null);
  options = input.required<{id:string,value:string}[]>();
  isReadonly = input<boolean>(false);
  submitted = input<boolean>(false);
  errors = input<{ [key: string]: string }>({});

  private onChange = (value: any) => { };
  private onTouched = () => { };

  private _selectedValue: any = null;
  ngControl!: NgControl;

  constructor(private injector: Injector) { }

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
    this._selectedValue = obj;
    this.onChange(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateValue(option: any) {
    this._selectedValue = option.id;
    this.onChange(option.id);
    this.onTouched();
  }

  isSelected(option: any): boolean {
    return option.id === this._selectedValue;
  }

  preventChanges(event: Event) {
    if (this.isReadonly()) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }

}
