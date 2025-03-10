import {
  Component,
  ElementRef,
  inject,
  input,
  Input,
  InputSignal,
  OnChanges,
  Renderer2,
  Self,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: '[controlSelect]',
  templateUrl: './control-select.component.html',
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, TitleCasePipe ]
})
export class ControlSelectComponent implements ControlValueAccessor, OnChanges {
  readonly validation: ValidationService = inject(ValidationService);

  autofocus: InputSignal<boolean> = input(false);
  isNew: InputSignal<boolean> = input(false);
  solid: InputSignal<boolean> = input(false);

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() id?: string;
  @Input() formText?: string;
  @Input() isReadonly: boolean = false;
  @Input() submitted: boolean = false;
  @Input() hideIsOptional: boolean = false;
  @Input() errors: { [key: string]: string } = {};
  @Input() options: any[] = [];
  @Input() showPrice: boolean = false;
  @Input() isAddress: boolean = false;
  @Input() isPaymentMethod: boolean = false;
  @Input() isInsurance: boolean = false;

  get control(): FormControl { return this.ngControl.control as FormControl; }

  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.options = changes['options'].currentValue;
    }
  }

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }
}
