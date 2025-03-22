import {
  Component,
  computed,
  effect,
  HostBinding,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { SelectOption } from "src/app/_models/base/selectOption";
import { debounceTime, map, Observable, startWith } from "rxjs";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "[controlTypeahead3]",
  templateUrl: "./control-typeahead-3.component.html",
  styleUrls: [ "./control-typeahead-3.component.scss" ],
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    CommonModule,
    FormsModule,
    CdkModule,
    MaterialModule,
  ],
})
export class ControlTypeahead3Component implements OnInit {
  control: ModelSignal<FormControl2<SelectOption | null>> = model.required<FormControl2<SelectOption | null>>();
  fromWrapper: ModelSignal<boolean> = model.required<boolean>();
  useIcon: InputSignal<boolean> = input<boolean>(false);

  onSelectionChange: OutputEmitterRef<SelectOption | null> = output();
  filteredOptions: Observable<SelectOption[]> = new Observable<SelectOption[]>();

  root: Signal<FormGroup2<any>> = computed(() => this.control().root as FormGroup2<any>);

  class: string = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect((): void => {
      if (this.fromWrapper()) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.root().validation));
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.control()
      .valueChanges
      .pipe(startWith(''), debounceTime(50), map((value: string | SelectOption | null): SelectOption[] => {
          // No value: show full list
          if (!value) return this.control().selectOptions;

          // User typed something
          if (typeof value === 'string') return this.filter(value);

          // Value is a SelectOption
          return this.control().selectOptions;
        })
      );
  }

  displayFn: (option: SelectOption) => string = (option: SelectOption): string => option?.name || '';

  /**
   * Filters all available options by the typed input.
   */
  private filter(value: string): SelectOption[] {
    const filterValue: string = this.normalizeValue(value);
    return this.control().selectOptions.filter((option: SelectOption) =>
      this
        .normalizeValue(option.name)
        .includes(filterValue)
    );
  }

  /**
   * Removes accents, spaces, and transforms to lower-case for matching.
   */
  private normalizeValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s/g, '');
  }
}
