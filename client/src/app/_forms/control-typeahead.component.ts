import { Component, ElementRef, inject, input, Input, Renderer2, Self } from '@angular/core';
import { PopoverProps } from 'src/app/_models/popover';
import { NgControl, FormControl, ReactiveFormsModule } from '@angular/forms'
import { NgClass, KeyValuePipe, NgTemplateOutlet, NgIf } from '@angular/common';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormsService } from 'src/app/_services/forms.service';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { OptionalSpanComponent } from "./helpers/optional-span.component";
import { NewBadgeComponent } from "./helpers/new-badge.component";

@Component({
  selector: '[controlTypeahead]',
  templateUrl: './control-typeahead.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, TypeaheadModule, NgTemplateOutlet, NgIf, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent]
})
export class ControlTypeaheadComponent {
  service = inject(FormsService);

  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);
  errors = input<{ [key: string]: string }>({});
  submitted = input<boolean>(false);
  formText = input<string>();

  @Input() id?: string;
  @Input() popoverProps?: PopoverProps;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() isReadonly= false;
  @Input() typeaheadOptions: string[] = [];
  @Input() hideIsOptional= false;

  get control(): FormControl { return this.ngControl.control as FormControl; }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('input');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }
}
