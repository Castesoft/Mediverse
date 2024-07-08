import { AfterViewInit, Component, Input } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { isControlOptional } from '../../utils/util';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: '[controlCheckList]',
  templateUrl: './form-check-list.component.html',
  standalone: true,
  imports: [ KeyValuePipe ],
})
export class FormCheckListComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() formText?: string;
  @Input() isReadonly: boolean = false;
  @Input() isOptional: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
    }
  }

  onCheckboxChange(option: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    const values = (this.control.value || '').split(',').filter((v: string) => !!v);

    if (checked) {
      values.push(option);
    } else {
      const index = values.indexOf(option);
      if (index >= 0) {
        values.splice(index, 1);
      }
    }

    const newValue = values.join(',');
    this.onChange(newValue);
    this.onTouched();

    if (!newValue) {
      this.control.setErrors({ required: true });
    } else {
      this.control.setErrors(null);
    }
  }

  writeValue(value: any): void {
    if (!value) {
      this.onChange('');
    } else {
      this.onChange(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  isOptionSelected(option: string): boolean {
    const selectedOptions = (this.control.value || '').split(',').filter((v: string) => !!v);
    return selectedOptions.includes(option);
  }

  preventChanges(event: Event) {
    if (this.isReadonly) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }
}
