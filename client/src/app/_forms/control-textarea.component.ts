import { KeyValuePipe, NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, Input, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import {FormControlStyles} from "src/app/_models/types";
import { FormsService } from 'src/app/_services/forms.service';
import { OptionalSpanComponent } from "./helpers/optional-span.component";
import { NewBadgeComponent } from "./helpers/new-badge.component";

@Component({
  host: { class: 'fv-row mb-7', },
  selector: '[controlTextarea]',
  templateUrl: './control-textarea.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, NgStyle, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent],
  styles: `
.invalid-feedback.show-feedback {
  display: block !important;
}

.invalid-feedback {
  display: block !important;
}

.form-label {
  display: flex;
  align-items: center;
  padding-bottom: -20px !important;
}`
})
export class ControlTextareaComponent implements ControlValueAccessor, AfterViewInit {
  service = inject(FormsService);

  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  errors = input<{ [key: string]: string }>({});
  submitted = input<boolean>(false);
  formText = input<string>();
  style = input<FormControlStyles>('solid');

  @Input() id?: string;
  @Input() label: string = '';
  @Input() isReadonly= false;
  @Input() hideIsOptional= false;
  @Input() fill= false;

  get control(): FormControl { return this.ngControl.control as FormControl; }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }
  get value(): string | undefined { if (!this.control.value) return undefined; return this.control.value.toString(); }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('textarea');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }

}
