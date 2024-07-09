import { Component, ElementRef, inject, input, Input, OnInit, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { KeyValuePipe, NgClass } from '@angular/common';
import { FormsService } from 'src/app/_services/forms.service';
import { OptionalSpanComponent } from "./helpers/optional-span.component";
import { NewBadgeComponent } from "./helpers/new-badge.component";

@Component({
  selector: '[controlDate]',
  templateUrl: './control-date.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, BsDatepickerModule, OptionalSpanComponent, NewBadgeComponent],
  styles: `
.bs-datepicker-container {
  padding: 0 !important;
}

.invalid-feedback.show-feedback {
  display: block !important;
}

.inset {
  position: absolute;
  top: 6.7345px;
  right: 10px;
  z-index: 1;
}

.form-control:disabled {
  background-color: transparent !important;
}

.form-label {
  display: flex;
  align-items: center;
}

.form-label .badge {
  margin-left: 4px;
  margin-top: -4px;
}`
})
export class ControlDateComponent implements ControlValueAccessor, OnInit {
  service = inject(FormsService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  optional = input<boolean>(false);

  @Input() id?: string;
  @Input() label: string = '';
  @Input() formText?: string;
  @Input() placeholder: string = '';
  @Input() maxDate: Date | undefined;
  @Input() isReadonly= false;
  @Input() hideIsOptional= false;
  @Input() submitted= false;
  @Input() errors: { [key: string]: string } = {};
  @Input() minMode: 'day' | 'month' | 'year' = 'day';
  @Input() popoverText?: string;
  @Input() popoverTitle?: string;

  bsConfig: Partial<BsDatepickerConfig> | undefined;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('input');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }

    const dateInputFormats = {
      'day': 'YYYY-MM-DD',
      'month': 'YYYY-MM',
      'year': 'YYYY'
    };

    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: dateInputFormats[this.minMode],
      startView: 'year',
      minMode: this.minMode,
      adaptivePosition: true,
      isAnimated: true,
    }

    if (this.isReadonly && this.ngControl.control) {
      if (this.popoverText === undefined) this.popoverText = this.ngControl.control!.value;
      if (this.popoverTitle === undefined) this.popoverTitle = this.label;
    }
  }

  writeValue(obj: any): void {  }
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName';
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.control.setValue(null);
    }
  }
}
