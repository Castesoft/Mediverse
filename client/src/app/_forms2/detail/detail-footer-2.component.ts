import { CommonModule } from "@angular/common";
import { Component, inject, model, effect, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { View } from "src/app/_models/base/types";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { DevService } from 'src/app/_services/dev.service';
import { ValidationService } from "src/app/_services/validation.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";


@Component({
  host: { class: 'd-flex align-items-center mt-2', },
  selector: 'div[detailFooter2]',
  // template: ``,
  templateUrl: './detail-footer-2.component.html',
  standalone: true,
  imports: [CommonModule, CdkModule, MaterialModule, FormsModule, ReactiveFormsModule,],
})
export class DetailFooter2Component {
  dev = inject(DevService);
  validation = inject(ValidationService);

  view = model.required<View>();
  dictionary = model.required<NamingSubject>();
  form = model.required<FormGroup2<any>>();

  label = signal<'Desactivado' | 'Activado'>('Desactivado');

  constructor() {

    effect(() => {
      this.label.set(this.validation.active() ? 'Activado' : 'Desactivado');
    });
  }
}
