import { CommonModule } from '@angular/common';
import { Component, effect, input, model } from '@angular/core';
import { BadRequest } from 'src/app/_models/types';

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
  error = model.required<BadRequest>();

  constructor() {
    effect(() => {
      console.log(this.error());

    })
  }
}
