import {Component, ElementRef, inject, input, Input, OnInit, Renderer2, Self} from '@angular/core';
import {ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule} from '@angular/forms';
import {KeyValuePipe, NgClass} from '@angular/common';
import {FlatpickrModule} from "angularx-flatpickr";
import {HelpBlockComponent} from "src/app/_forms/helpers/help-block.component";
import {InvalidFeedbackComponent} from "src/app/_forms/helpers/invalid-feedback.component";
import {FormControlStyles} from "src/app/_models/types";
import {FormsService} from 'src/app/_services/forms.service';
import {OptionalSpanComponent} from "./helpers/optional-span.component";
import {NewBadgeComponent} from "./helpers/new-badge.component";

@Component({
  host: {class: 'fv-row mb-9',},
  selector: '[controlDate]',
  templateUrl: './control-date.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, OptionalSpanComponent, NewBadgeComponent, HelpBlockComponent,
    InvalidFeedbackComponent, FlatpickrModule,],
})
export class ControlDateComponent implements ControlValueAccessor, OnInit {
  service = inject(FormsService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  errors = input<{ [key: string]: string }>({});
  formText = input<string>();
  submitted = input<boolean>(false);
  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  optional = input<boolean>(false);
  timepicker = input<boolean>(false);
  style = input<FormControlStyles>('solid');

  @Input() id?: string;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxDate: Date | undefined;
  @Input() isReadonly = false;
  @Input() hideIsOptional = false;
  @Input() minMode: 'day' | 'month' | 'year' = 'day';
  @Input() popoverText?: string;
  @Input() popoverTitle?: string;

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

    if (this.isReadonly && this.ngControl.control) {
      if (this.popoverText === undefined) this.popoverText = this.ngControl.control!.value;
      if (this.popoverTitle === undefined) this.popoverTitle = this.label;
    }
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

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
