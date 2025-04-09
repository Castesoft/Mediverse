import {
  Component,
  computed,
  effect,
  HostBinding,
  inject,
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
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";

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
    FaIconComponent,
  ]
})
export class ControlMultiselect3Component implements OnInit {
  readonly icons: IconsService = inject(IconsService);

  control: ModelSignal<FormControl2<SelectOption[] | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required();
  displayMode: ModelSignal<'dropdown' | 'checkboxList'> = model<'dropdown' | 'checkboxList'>('dropdown');

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
      let baseClass = 'mb-0'; 
      if (this.fromWrapper()) {
        baseClass += ' w-100';
      } else {
        baseClass += ' col-auto px-0';
      }
      this.class = baseClass; 

      try {
        this.control.set(this.control().setValidation(this.root().validation));
      } catch (e) {
        console.error("Error setting validation in effect:", this.root())
        console.error(e);
      }
    });
  }

  get visibleOrEnabledOptions(): number {
    return this.control().selectOptions.filter(option => option.visible && option.enabled).length;
  }

  get value(): SelectOption[] | null {
    return this.control().value;
  }

  get count(): number {
    return this.control().value?.length || 0;
  }

  get optionsCount(): number {
    return this.control().selectOptions.length;
  }

  handleClick(): void {
    console.log(this.control().selectOptions);
  }

  ngOnInit(): void {
    this.filteredOptions = this.control().valueChanges.pipe(
      startWith(''), 
      map((value: string | SelectOption[] | null | undefined) => { 
        
        if (typeof value === 'string') {
          return this._filter(value as string)
        }
        
        return this.control().selectOptions.filter(opt => opt.visible); 
      }),
    );
  }

  private _filter(value: string): SelectOption[] {
    const filterValue: string = this._normalizeValue(value);
    return this.control().selectOptions.filter((option: SelectOption) =>
      option.visible && this._normalizeValue(option.name).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    if (!value) return '';
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s/g, '');
  }

  addAllOptions() {
    const allAvailableOptions = this.control().selectOptions.filter(opt => opt.visible && opt.enabled);
    this.control.update(oldValue => {
      oldValue.patchValue(allAvailableOptions);
      oldValue.markAsDirty();
      return oldValue;
    })
  }

  deselectOption(optionToDeselect: SelectOption): void {
    const currentValue = this.control().value;
    if (!currentValue) {
      return;
    }

    const newValue = currentValue.filter(option => option.id !== optionToDeselect.id);

    this.control.update(oldValue => {
      oldValue.patchValue(newValue.length > 0 ? newValue : null);
      oldValue.markAsDirty();
      return oldValue;
    });
  }

  isOptionSelected(option: SelectOption): boolean {
    return this.value?.some(v => v.id === option.id) ?? false;
  }

  clearOptions() {
    this.control.update(oldValue => {
      oldValue.patchValue(null);
      oldValue.markAsDirty();
      return oldValue;
    })
  }

  onCheckboxChange(checked: boolean, option: SelectOption): void {
    const currentValue = this.control().value || [];
    let newValue: SelectOption[];

    if (checked) {
      // Add the option if it's not already present
      if (!currentValue.some(v => v.id === option.id)) {
        newValue = [...currentValue, option];
      } else {
        newValue = currentValue; // Should not happen if logic is correct, but safe fallback
      }
    } else {
      // Remove the option
      newValue = currentValue.filter(v => v.id !== option.id);
    }

    this.control.update(oldValue => {
      oldValue.patchValue(newValue.length > 0 ? newValue : null);
      oldValue.markAsDirty();
      return oldValue;
    });
  }
}
