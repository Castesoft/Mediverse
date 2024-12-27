import { Component, computed, effect, HostBinding, inject, model, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { map, Observable, startWith } from "rxjs";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "div[controlMultiselect3]",
  templateUrl: "./control-multiselect-3.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, Forms2HelperModule, CommonModule, FormsModule, CdkModule, MaterialModule,]
})
export class ControlMultiselect3Component {
  validation = inject(ValidationService);

  control = model.required<FormControl2<SelectOption[] | null>>();
  fromWrapper = model.required<boolean>();

  onSelectionChange = output<SelectOption | null>();

  filteredOptions: Observable<SelectOption[]> = new Observable<SelectOption[]>();

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });
  class = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      console.log('controlMultiselect3', this.control());


      if (this.fromWrapper() === true) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.control().valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filter(value as string)
        }

        return this.control().selectOptions;
      }),
    )
  }

  displayFn(option: SelectOption): string {
    return option?.name || '';
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = this._normalizeValue(value);
    return this.control().selectOptions.filter(option => this._normalizeValue(option.name).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s/g, '');
  }
}
