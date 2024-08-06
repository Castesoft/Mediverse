import { Component, Input, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { FormsService } from 'src/app/_services/forms.service';
import { NewBadgeComponent } from 'src/app/_forms/helpers/new-badge.component';
import { OptionalSpanComponent } from 'src/app/_forms/helpers/optional-span.component';
import { InvalidFeedbackComponent } from './helpers/invalid-feedback.component';

@Component({
  selector: '[controlCheckList]',
  templateUrl: './control-check-list.component.html',
  standalone: true,
  imports: [KeyValuePipe, OptionalSpanComponent, NewBadgeComponent, InvalidFeedbackComponent]
})
export class ControlCheckListComponent implements ControlValueAccessor {
  service = inject(FormsService);

  isNew = input<boolean>(false);

  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() formText?: string;
  @Input() isReadonly= false;
  @Input() submitted= false;
  @Input() errors: { [key: string]: string } = {};

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
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
