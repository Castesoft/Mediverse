import { Component } from "@angular/core";


@Component({
  host: { class: 'btn btn-light-primary me-3', type: 'button', },
  selector: 'button[filterMenuBtn]',
  template: `
    <i class="ki-duotone ki-filter fs-2">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>Filtros
  `,
  standalone: true,
  imports: [],
})
export class FilterMenuBtnComponent {
}
