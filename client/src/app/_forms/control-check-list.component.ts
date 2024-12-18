import { Component, Input, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvalidFeedbackComponent } from './helpers/invalid-feedback.component';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: '[controlCheckList]',
  templateUrl: './control-check-list.component.html',
  standalone: true,
  imports: [CommonModule, InvalidFeedbackComponent]
})
export class ControlCheckListComponent implements ControlValueAccessor {
  validation = inject(ValidationService);

  isNew = input<boolean>(false);

  @Input() label: string = '';
  @Input() options: string[] | {id: number, name: string}[] = [];
  @Input() formText?: string;
  @Input() isReadonly= false;
  @Input() submitted= false;
  @Input() errors: { [key: string]: string } = {};

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  getOptionName(option: string | {id: number, name: string}): string {
    return typeof option === 'object' ? option.name : option;
  }

  constructor(public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  onCheckboxChange(option: string | {id: number, name: string}, event: Event) {
    const selectedOptions = (this.control.value || '').split(',').filter((v: string) => !!v);
    const optionValue = typeof option === 'object' ? option.id : option;

    if ((event.target as HTMLInputElement).checked) {
      selectedOptions.push(optionValue.toString());
    } else {
      const index = selectedOptions.indexOf(optionValue.toString());
      if (index > -1) {
        selectedOptions.splice(index, 1);
      }
    }

    this.onChange(selectedOptions.join(','));
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

  isOptionSelected(option: string | {id: number, name: string} | number): boolean {
    if (typeof option === 'object') {
      return this.isOptionSelected(option.id);
    }


    const selectedOptions = (this.control.value || '').split(',').filter((v: string) => !!v);
    return selectedOptions.includes(option.toString());
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
