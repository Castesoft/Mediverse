import { AfterViewInit, Component, inject, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from '../_services/icons.service';
import { isControlOptional } from '../_utils/util';

@Component({
  selector: '[searchText]',
  templateUrl: './search-text.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, FontAwesomeModule ]
})
export class SearchTextComponent implements ControlValueAccessor, AfterViewInit {
  icons = inject(IconsService);

  @Input({ required: false }) label: string | null | 'Encontrar...' = null;
  @Input({ required: false }) placeholder: string = 'Encontrar...';
  @Input({ required: false }) submitAttempted = false;
  @Input({ required: false }) customErrorMessages: { [key: string]: string } = {};
  @Input({ required: false }) id?: string;
  @Input({ required: false }) shouldAutoFocus = false;
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
  setDisabledState?(isDisabled: boolean): void { }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }

}
