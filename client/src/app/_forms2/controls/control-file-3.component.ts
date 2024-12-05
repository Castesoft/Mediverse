import { CommonModule } from "@angular/common";
import { Component, inject, model, computed, effect, HostBinding } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  selector: 'div[controlFile3]',
  templateUrl: './control-file-3.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, Forms2HelperModule,  ],
})
export class ControlFile3Component {
  validation = inject(ValidationService);

  fromWrapper = model.required<boolean>();
  control = model.required<FormControl2<File | null>>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  file: File | null = null;

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
        this.file = files[0];
        const control = this.control();
        const filenew = new File([this.file as Blob], this.file?.name, { type: this.file?.type });
        control.patchValue(filenew);
        this.control.set(control);
      }
    }

    // console.log('good',event);
    // if (event.target.files.length > 0) {
    //   this.file = event.target.files[0];
    //   console.log('good',this.file);


    //   const control = this.control();
    //   control.patchValue(this.file);
    //   this.control.set(control);
    // }
  }
}
