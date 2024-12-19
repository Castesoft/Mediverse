import { Component, input } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BadRequest } from 'src/app/_models/forms/badRequest';

@Component({
  host: { class: 'col' },
  selector: 'div[errorsAlert]',
  template: `
      <alert [type]="'danger'">
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
      </alert>
  `,
  standalone: true,
  imports: [AlertModule],
})
export class ErrorsAlertComponent {
  error = input.required<BadRequest>();
}
