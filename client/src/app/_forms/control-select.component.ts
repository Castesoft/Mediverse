import { AfterViewInit, Component, ElementRef, inject, input, Input, OnChanges, output, Renderer2, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { FormsService } from 'src/app/_services/forms.service';
import { OptionalSpanComponent } from "./helpers/optional-span.component";
import { NewBadgeComponent } from "./helpers/new-badge.component";

@Component({
  selector: '[controlSelect]',
  templateUrl: './control-select.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, OptionalSpanComponent, NewBadgeComponent, TitleCasePipe]
})
export class ControlSelectComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  service = inject(FormsService);

  autofocus = input<boolean>(false);
  isNew = input<boolean>(false);

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() id?: string;
  @Input() formText?: string;
  @Input() isReadonly= false;
  @Input() submitted= false;
  @Input() hideIsOptional= false;
  @Input() errors: { [key: string]: string } = {};
  @Input() options: any[] = [];
  @Input() showPrice = false;
  @Input() isAddress = false;
  @Input() isPaymentMethod = false;
  @Input() isInsurance = false;

  get control(): FormControl { return this.ngControl.control as FormControl; }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    // if (this.autofocus()) {
    //   const inputEl = this.el.nativeElement.querySelector('select');
    //   this.renderer.setAttribute(inputEl, 'autofocus', 'autofocus');
    //   inputEl.focus();
    // }
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
