import { CommonModule } from "@angular/common";
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Renderer2,
  Self
} from "@angular/core";
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from "@angular/forms";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { InputTypes } from "src/app/_models/forms/formTypes";
import { PopoverProps } from "src/app/_models/popover";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  host: { class: 'd-flex flex-column fv-row', },
  selector: 'div[inputControl]',
  templateUrl: './input-control.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InvalidFeedbackComponent,
    HelpBlockComponent,
  ],
})
export class InputControlComponent implements ControlValueAccessor, OnInit {
  validation: ValidationService = inject(ValidationService);

  errors: InputSignal<{ [key: string]: string }> = input({});
  formText: InputSignal<string | null> = input(null as string | null);
  submitted: InputSignal<boolean> = input(false);
  autofocus: InputSignal<boolean> = input(false);
  isNew: InputSignal<boolean> = input(false);
  optional: InputSignal<boolean> = input(false);
  solid: InputSignal<boolean> = input(false);

  onChange: OutputEmitterRef<any> = output<any>();

  @Input() id?: string;
  @Input() popoverProps?: PopoverProps;
  @Input() label: string = '';
  @Input({ required: false }) type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() datalistOptions?: any[] | null = null;
  @Input() isReadonly: boolean = false;
  @Input() hideIsOptional: boolean = false;
  @Input() useInputGroup: boolean = false;
  @Input() append: string = '';
  @Input() popoverText?: string;
  @Input() popoverTitle?: string;
  @Input() isPending: boolean | undefined = false;
  @Input() role: string = 'presentation';
  @Input() spellcheck: boolean = false;
  @Input() autocomplete: string = 'disabled';

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }

  get control(): FormControl { return this.ngControl.control as FormControl; }

  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }

  get controlErrors(): { [key: string]: string } {
    return this.control.errors || {};
  }

  get value(): string | undefined {
    if (!this.control.value) return undefined;
    return this.control.value.toString();
  }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;

    effect(() => {
      this.control.updateValueAndValidity();
    })
  }

  ngOnInit(): void {
    if (this.ngControl.control) {
      if (this.isReadonly && this.ngControl.control) {
        if (this.popoverText === undefined) this.popoverText = this.ngControl.control!.value;
        if (this.popoverTitle === undefined) this.popoverTitle = this.label;
      }
    }
  }

  handleChange(event: any) {
    this.onChange.emit(event);
  }
}
