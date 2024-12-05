import { CommonModule } from "@angular/common";
import { Component, computed, effect, HostBinding, inject, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ValidationService } from "src/app/_services/validation.service";

@Component({
  selector: 'div[controlFileImage3]',
  templateUrl: './control-file-image-3.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, Forms2HelperModule, ],
})
export class ControlFileImage3Componnent {
  validation = inject(ValidationService);

  fromWrapper = model.required<boolean>();
  control = model.required<FormControl2<File | null>>();
  root = computed<FormGroup2<any>>(() => {
    return this.control().root as FormGroup2<any>;
  })

  image: File | null = null;
  imageURL: string | ArrayBuffer | null = null;;

  class = 'mb-0';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if(this.fromWrapper()) {
        this.class += 'w-100';
      } else {
        this.class += 'col-auto px-0';
      }

      this.control.set(this.control().setValidation(this.validation.active()));
    })
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target !== null) {
      const files: FileList | null = target.files;
      if (files !== null) {
        this.image = files[0];

        const reader = new FileReader();
        reader.onload = () => {
          this.imageURL = reader.result;
        }
        reader.readAsDataURL(this.image);

        const control = this.control();
        const filenew = new File([this.image as Blob], this.image?.name, { type: this.image?.type });
        control.patchValue(filenew);
        this.control.set(control);
      }
    }
  }
}