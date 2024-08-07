import { AfterViewInit, Component, ElementRef, inject, input, Input, OnInit, output, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import {FormControlStyles, InputTypes} from 'src/app/_models/types';
import { NgClass } from '@angular/common';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { PopoverProps } from 'src/app/_models/popover';
import { FormsService } from 'src/app/_services/forms.service';

@Component({
  host: { class: 'd-flex flex-column fv-row', },
  selector: 'div[inputControl]',
  templateUrl: './input-control.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass,
    InvalidFeedbackComponent, HelpBlockComponent,
   ],
})
export class InputControlComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  service = inject(FormsService);

  errors = input<{ [key: string]: string }>({});
  formText = input<string>();
  submitted = input<boolean>(false);
  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  optional = input<boolean>(false);
  style = input<FormControlStyles>('solid');

  onChange = output<any>();

  @Input() id?: string;
  @Input() popoverProps?: PopoverProps;
  @Input() label: string = '';
  @Input({ required: false }) type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() datalistOptions?: any[] | null = null;
  @Input() isReadonly= false;
  @Input() hideIsOptional= false;
  @Input() useInputGroup= false;
  @Input() append: string = '';
  @Input() popoverText?: string;
  @Input() popoverTitle?: string;
  @Input() isPending?= false;
  @Input() role = 'presentation';
  @Input() spellcheck = false;
  @Input() autocomplete = 'disabled';

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }

  get control(): FormControl { return this.ngControl.control as FormControl; }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }
  get value(): string | undefined { if (!this.control.value) return undefined; return this.control.value.toString(); }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.service.mode$.subscribe({ next: _ => this.control.updateValueAndValidity() });

    if (this.ngControl.control) {
      if (this.isReadonly && this.ngControl.control) {
        if (this.popoverText === undefined) this.popoverText = this.ngControl.control!.value;
        if (this.popoverTitle === undefined) this.popoverTitle = this.label;
      }
    }
  }

  ngAfterViewInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('input');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }
  }

  handleChange(event: any) {
    this.onChange.emit(event);
  }
}
