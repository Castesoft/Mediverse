import { AfterViewInit, Component, Injector, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { isControlOptional } from '../../utils/util';
import { KeyValuePipe, NgClass } from '@angular/common';

@Component({
  selector: '[controlCheckRadio]',
  templateUrl: './form-check-radio.component.html',
  standalone: true,
  imports: [ NgClass, KeyValuePipe ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormCheckRadioComponent),
    multi: true,
  }]
})
export class FormCheckRadioComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  @Input() id?: string;
  @Input() label: string = '';
  @Input() formText?: string;
  @Input() options: any[] = [];
  @Input() isOptional: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() shouldAutoFocus: boolean = false;



  private onChange = (value: any) => { };
  private onTouched = () => { };

  private _selectedValue: any = null;
  ngControl!: NgControl;

  constructor(private injector: Injector) { }

  ngAfterViewInit(): void {
    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
    }
  }

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
    if (this.isReadonly) {
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
