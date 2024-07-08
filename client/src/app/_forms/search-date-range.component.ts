import { AfterViewInit, Component, inject, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { IconsService } from '../_services/icons.service';
import { datepickerConfig, isControlOptional } from '../_utils/util';

@Component({
  selector: '[searchDateRange]',
  templateUrl: './search-date-range.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, FontAwesomeModule,
    BsDatepickerModule
   ]
})
export class SearchDateRangeComponent implements ControlValueAccessor, AfterViewInit {
  icons = inject(IconsService);

  @Input({ required: false }) label: string | null | 'Rango de fechas' = null;
  @Input({ required: false }) datepickerConfig: Partial<BsDatepickerConfig> = datepickerConfig;
  @Input({ required: false }) placeholder: string = 'Rango de fechas';
  @Input({ required: false }) submitAttempted = false;
  @Input({ required: false }) customErrorMessages: { [key: string]: string } = {};
  @Input({ required: false }) id?: string;
  @Input({ required: false }) formText?: string;
  @Input() isOptional: boolean = false;

  constructor(
    @Self() public ngControl: NgControl,
  ) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
    }
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }

}
