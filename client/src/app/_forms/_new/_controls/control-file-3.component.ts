import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ControlInput3Component } from "src/app/_forms/_new/_controls/control-input-3.component";
import { FormNewHelperModule } from "src/app/_forms/_new/_helper/form-new-helper.module";
import { FormControl2, FormGroup2 } from "src/app/_forms/form2";
import { FormsService } from "src/app/_services/forms.service";

@Component({
  host: { class: "fw-semibold mb-0 w-100" },
  selector: 'div[controlFile3]',
  templateUrl: './control-file-3.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, FormNewHelperModule, ControlInput3Component, ],
})
export class ControlFile3Component {
  service = inject(FormsService);

  control = model.required<FormControl2<File | null>>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  });

  validation = false;
  file: File | null = null;

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({
        next: (validation) => this.control.set(this.control().setValidation(validation))
      });
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
