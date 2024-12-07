import { CommonModule, KeyValuePipe } from "@angular/common";
import { Component, effect, model } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { ControlErrors } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: '', },
  selector: 'invalid-feedback, div[invalidFeedback]',
  template: `
@for(error of control().errors | keyvalue; track $index) {
  @if(submitted() && control().invalid) {
    <div class="invalid-feedback d-block">
      @if (!errors()[error.key]) {
        @switch(error.key) {
          @case('required') {
            Este campo es requerido.
          }
          @case('email') {
            Debe ser un email válido.
          }
          @case('minlength') {
            Debe tener al menos {{ control().errors?.['minlength'].requiredLength }} caracteres.
          }
          @case('maxlength') {
            Deber tener un máximo de {{ control().errors?.['maxlength'].requiredLength }} caracteres.
          }
          @case('pattern') {
            El formato es inválido.
          }
          @case('min') {
            Debe ser mayor o igual a {{ control().errors?.['min'].min }}.
          }
          @case('max') {
            Deber ser menor o igual a {{ control().errors?.['max'].max }}.
          }
          @case('nameExists') {
            El nombre ya existe.
          }
          @case('controlNumberExists') {
            El número de control ya existe.
          }
          @case('maxDate') {
            La fecha debe ser menor o igual a {{ control().errors?.['maxDate'].maxDate | date: 'dd/MM/yyyy' }}.
          }
          @default {
            Error desconocido.
          }
        }
      } @else {
        {{ errors()[error.key] }}
      }
    </div>
  }
}
  `,
  standalone: true,
  imports: [ KeyValuePipe, CommonModule, ],
})
export class InvalidFeedbackComponent {
  errors = model.required<ControlErrors>({});
  submitted = model.required<boolean>();
  control = model.required<FormControl<any> | AbstractControl<any, any>>();

  constructor() {
    effect(() => {
      // console.log(this.control());
    })
  }
}
