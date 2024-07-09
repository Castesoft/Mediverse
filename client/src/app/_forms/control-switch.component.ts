import { AfterViewInit, Component, ElementRef, inject, input, Input, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { NgClass, KeyValuePipe } from '@angular/common';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { NewBadgeComponent } from 'src/app/_forms/helpers/new-badge.component';
import { OptionalSpanComponent } from 'src/app/_forms/helpers/optional-span.component';
import { FormsService } from 'src/app/_services/forms.service';

@Component({
  selector: '[controlSwitch]',
  templateUrl: './control-switch.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass, KeyValuePipe, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent, ],
})
export class ControlSwitchComponent implements ControlValueAccessor, AfterViewInit {
  service = inject(FormsService);

  autofocus = input<boolean>(false);
  formText = input<string>();
  submitted = input<boolean>(false);
  errors = input<{ [key: string]: string }>({});

  @Input() id?: string;
  @Input() label: string = '';
  @Input() isReadonly= false;

  private onChange = (value: any) => { };

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

  writeValue(obj: any): void {
    if (obj !== this.control.value) {
      this.control.setValue(obj, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isReadonly = isDisabled;

    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    const formGroup = this.control?.parent as FormGroup;
    let name = 'defaultName';

    if (formGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        if (this.control === formGroup.controls[key]) {
          name = key;
        }
      });
    }

    return name;
  }


  onTouched = () => { };

  ngOnInit() {
    this.control.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.onChange(value);
      });
  }
}
