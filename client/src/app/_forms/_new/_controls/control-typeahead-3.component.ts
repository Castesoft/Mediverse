import { Component, computed, effect, inject, model, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormsService } from "src/app/_services/forms.service";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { SelectOption } from "src/app/_forms/form";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { MatOptionSelectionChange } from "@angular/material/core";
import { map, Observable, startWith } from "rxjs";

@Component({
  selector: "[controlTypeahead3]",
  host: { class: 'fw-semibold mb-0 w-100', },
  templateUrl: "./control-typeahead-3.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, FormNewHelperModule, CommonModule, FormsModule, CdkModule, MaterialModule,
  ],
})
export class ControlTypeahead3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<SelectOption | null>>();

  filteredOptions: Observable<SelectOption[]> = new Observable<SelectOption[]>();

  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  validation = false;

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
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
