import { Component, ElementRef, Input, OnInit, Renderer2, Self } from '@angular/core';
import { PopoverProps } from '../../../_models/popover';
import { NgControl, FormControl, ReactiveFormsModule } from '@angular/forms'
import { isControlOptional } from '../../utils/util';
import { NgClass, KeyValuePipe, NgTemplateOutlet, NgIf } from '@angular/common';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: '[controlTypeahead]',
  templateUrl: './form-control-typeahead.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, TypeaheadModule, NgTemplateOutlet, NgIf ],
})
export class ControlTypeaheadComponent implements OnInit {
  @Input() id?: string;
  @Input() formText?: string;
  @Input() popoverProps?: PopoverProps;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() isReadonly: boolean = false;
  @Input() isOptional: boolean = false;
  @Input() shouldAutoFocus: boolean = false;
  @Input() submitAttempted: boolean = false;
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() typeaheadOptions: string[] = [];
  @Input() hideIsOptional: boolean = false;

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2,
    private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.ngControl.control) {
      this.isOptional = isControlOptional(this.ngControl.control);
    }
  }

  ngAfterViewInit(): void {
    if (this.shouldAutoFocus) {
      const inputEl = this.el.nativeElement.querySelector('input');
      this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
      inputEl.focus();
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
