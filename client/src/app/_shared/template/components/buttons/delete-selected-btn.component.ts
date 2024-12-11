import { Component, input } from "@angular/core";


@Component({
  host: { class: 'd-flex justify-content-end align-items-center', },
  selector: 'div[deleteSelectedBtn]',
  template: `
    <div class="fw-bold me-5">
      <span class="me-2">{{count()}}</span>Seleccionados
    </div>
    <button type="button" class="btn btn-danger">Eliminar seleccionados</button>
  `,
  standalone: true,
  imports: [],
})
export class DeleteSelectedBtnComponent {
  count = input.required<number>();
}
