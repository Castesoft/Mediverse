import { Component, input } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
  host: { class: 'col' },
  selector: 'div[errorsAlert]',
  template: `
    @if (errors().length > 0) {
      <alert [type]="'danger'">
        <h4 class="alert-heading">Errores de validación del servidor</h4>
        <ul>
          @for (error of errors(); track idx; let idx = $index) {
            <li class="text-danger">{{ error }}</li>
          }
        </ul>
      </alert>
    }
  `,
  standalone: true,
  imports: [AlertModule],
})
export class ErrorsAlertComponent {
  errors = input.required<string[]>();
}
