import { CommonModule } from '@angular/common';
import { Component, effect, model } from '@angular/core';
import { FormGroup2 } from 'src/app/_forms/form2';

@Component({
  host: { class: 'alert alert-dismissible bg-light-danger border border-danger border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10' },
  selector: 'div[errorsAlert3]',
  templateUrl: './errors-alert-3.component.html',
  // template: `
  // `,
  standalone: true,
  imports: [CommonModule,],
})
export class ErrorsAlert3Component {
  form = model.required<FormGroup2<any>>();

  constructor() {
    effect(() => {
      console.log(this.form());

    })
  }

  onCloseClick() {
    this.form().removeError();
  }
}
