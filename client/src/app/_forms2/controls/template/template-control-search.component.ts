import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateRange } from "src/app/_models/base/dateRange";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { SelectOption } from "src/app/_models/base/selectOption";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ValidationService } from "src/app/_services/validation.service";
import { IconsModule } from "src/app/_shared/template/components/icons/icons.module";

@Component({
  host: { class: 'd-flex align-items-center position-relative my-1', },
  selector: 'div[templateControlSearch]',
  templateUrl: './template-control-search.component.html',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, IconsModule, ],
})
export class TemplateControlSearchComponent {
  validation = inject(ValidationService);

  control = model.required<FormControl2<string | number | boolean | Date | DateRange | SelectOption | null>>();
  fromWrapper = model.required<boolean>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  dictionary = model.required<NamingSubject>();

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

}
