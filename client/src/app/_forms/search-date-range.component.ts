import { Component, inject, input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { IconsService } from 'src/app/_services/icons.service';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { DatepickerService } from 'src/app/_services/datepicker.service';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  host: { class: '', },
  selector: '[searchDateRange]',
  templateUrl: './search-date-range.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, FontAwesomeModule,
    BsDatepickerModule, InvalidFeedbackComponent, HelpBlockComponent,
   ]
})
export class SearchDateRangeComponent implements ControlValueAccessor {
  icons = inject(IconsService);
  datepicker = inject(DatepickerService);
  validation = inject(ValidationService);

  label = input<string | null | 'Rango de fechas'>(null);
  datepickerConfig = input<Partial<BsDatepickerConfig>>(this.datepicker.config);
  placeholder = input<string>('Rango de fechas');
  errors = input<{ [key: string]: string }>({});
  id = input<string>();
  formText = input<string | null>(null);
  submitted = input<boolean>(false);
  labelClass = input<string>('form-label fw-semi-bold fs--1');
  inputClass = input<string>('form-control search-input search');

  get control(): FormControl { return this.ngControl.control as FormControl; }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }
}
