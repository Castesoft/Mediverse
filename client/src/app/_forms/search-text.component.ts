import { Component, ElementRef, inject, input, model, OnInit, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { ValidationService } from 'src/app/_services/validation.service';
import { NamingSubject } from 'src/app/_models/base/namingSubject';

@Component({
  host: { class: 'd-flex align-items-center position-relative my-1', },
  selector: '[searchText]',
  templateUrl: './search-text.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, FontAwesomeModule, ]
})
export class SearchTextComponent implements ControlValueAccessor, OnInit {
  icons = inject(IconsService);
  validation = inject(ValidationService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  errors = input<{ [key: string]: string }>({});
  id = input<string>();
  submitted = input<boolean>(false);
  label = input<string | null | 'Encontrar...'>(null);
  placeholder = model<string>('Encontrar...');
  autofocus = input<boolean>(false);
  formText = input<string | null>(null);
  naming = input<NamingSubject>();

  get control(): FormControl { return this.ngControl.control as FormControl; }
  get controlName(): string { return this.ngControl.name ? this.ngControl.name.toString() : 'defaultName'; }

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  ngOnInit(): void {
    if (this.naming()) {
      this.placeholder.set(`Buscar ${this.naming()!.singular}`);
    }
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
