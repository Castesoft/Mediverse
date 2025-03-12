import {
  Component,
  computed,
  effect,
  HostBinding,
  model,
  ModelSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectOption } from "src/app/_models/base/selectOption";
import { map, Observable, startWith } from "rxjs";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { InvalidFeedback3Component } from "src/app/_forms2/helper/invalid-feedback-3.component";

@Component({
  selector: "div[controlMultiselect3]",
  templateUrl: "./control-multiselect-3.component.html",
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    CommonModule,
    FormsModule,
    CdkModule,
    MaterialModule,
    InvalidFeedback3Component,
  ]
})
export class ControlMultiselect3Component implements OnInit {
  control: ModelSignal<FormControl2<SelectOption[] | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required();

  onSelectionChange: OutputEmitterRef<SelectOption | null> = output();

  filteredOptions: Observable<SelectOption[]> = new Observable();

  root: Signal<FormGroup2<any>> = computed(() => {
    return this.control().root as FormGroup2<any>;
  });

  class: string = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper()) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      try {
        this.control.set(this.control().setValidation(this.root().validation));
      } catch (e) {
        console.error(this.root())
        console.error(e);
      }
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.control().valueChanges.pipe(
      startWith(''),
      map((value: string | SelectOption[] | null) => {
        if (typeof value === 'string') {
          return this._filter(value as string)
        }

        return this.control().selectOptions;
      }),
    )
  }

  private _filter(value: string): SelectOption[] {
    const filterValue: string = this._normalizeValue(value);
    return this.control().selectOptions.filter((option: SelectOption) => this._normalizeValue(option.name).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s/g, '');
  }

  addAllOptions() {
    this.control.update(oldValue => {
      oldValue.patchValue(this.control().selectOptions);

      return oldValue;
    })
  }

  clearOptions() {
    this.control.update(oldValue => {
      oldValue.patchValue(null);

      return oldValue;
    })
  }

  optionChanged(event: any) {
    const controlToUpdate = this.control();
    controlToUpdate.setValue(event);
    controlToUpdate.markAsDirty();
    this.control.set(controlToUpdate);
  }
}
