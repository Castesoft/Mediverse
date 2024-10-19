import { Component, effect, inject, model, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TypeaheadMatch, TypeaheadModule } from "ngx-bootstrap/typeahead";
import { CommonModule } from "@angular/common";
import { FormsService } from "src/app/_services/forms.service";
import { ControlInput3Component } from "src/app/_forms/_new/_controls/control-input-3.component";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { FormControl2 } from "src/app/_forms/form2";

@Component({
  selector: "[controlTypeahead3]",
  templateUrl: "./control-typeahead-3.component.html",
  standalone: true,
  imports: [ReactiveFormsModule,
    FormNewHelperModule,
    CommonModule,
    ControlInput3Component,
    TypeaheadModule,
  ]

})
export class ControlTypeahead3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<string | null>>();

  onSelect = output<TypeaheadMatch>();
  onLoading = output<boolean>();

  validation = false;

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    });
  }
}
