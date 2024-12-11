import { Component } from "@angular/core";


@Component({
  host: { class: 'btn btn-light-primary me-3', type: 'button', },
  selector: 'button[exportBtn]',
  template: `
    <i class="ki-duotone ki-exit-up fs-2">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>Exportar
  `,
  standalone: true,
  imports: [],
})
export class ExportBtnComponent {
}
