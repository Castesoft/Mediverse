import { CommonModule } from "@angular/common";
import { Component, inject, model, computed, effect, HostBinding } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  selector: 'div[controlFiles3]',
  templateUrl: './control-files-3.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, Forms2HelperModule,  ],
})
export class ControlFiles3Component {
  validation = inject(ValidationService);

  fromWrapper = model.required<boolean>();
  control = model.required<FormControl2<File[] | null>>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  file: File | null = null;
  files: File[] | [] = [];
  class = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper() === true) {
        this.class += ' w-100';
      } else {
        this.class += ' col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target !== null) {
      const files: FileList | null = target.files;
      if (files !== null) {
        let filenews: File[] = [];
        // for(const file of files) {
        //   const filenew = new File([file as Blob], file?.name, { type: file?.type });
        //   filenews.push(filenew);
        // }
        const control = this.control();
        control.patchValue(filenews);
        this.control.set(control);
      }
    }
  }
}
