import { Component, effect, input } from '@angular/core';
import { BadRequest } from 'src/app/_models/types';

@Component({
  host: { class: 'alert alert-subtle-danger', role: 'alert' },
  selector: 'div[errorsAlert3]',
  template: `
        <h4 class="alert-heading">Errores: </h4>
        @if(error().type === 'ValidationError') {
          <ul>
            @for(error of error().validationErrors; let idx = $index; track idx) {
              <li>{{error}}</li>
            }
          </ul>
        }@else if(error().type === 'BadRequest') {
          <p>{{error().message}}</p>
        }
  `,
  standalone: true,
})
export class ErrorsAlert3Component {
  error = input.required<BadRequest>();

  constructor() {
    effect(() => {
      console.log(this.error());

    })
  }
}
