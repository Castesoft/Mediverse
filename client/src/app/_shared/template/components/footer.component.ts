import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: '[footer]',
  host: { class: 'footer py-4 d-flex flex-lg-column', id: 'kt_footer' },
  template: `
    <div class="container-fluid d-flex flex-column flex-md-row flex-stack">
      <div class="text-gray-900 order-2 order-md-1">
        <span class="text-muted fw-semibold me-2">{{ currentYear }}©</span>
        <a
          [routerLink]="[]"
          target="_blank"
          class="text-gray-800 text-hover-primary"
        >DocHub</a
        >
      </div>
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <a [routerLink]="[]" target="_blank" class="menu-link px-2">Nosotros</a>
        </li>
        <li class="menu-item">
          <a [routerLink]="[]" target="_blank" class="menu-link px-2">Ayuda</a>
        </li>
        <li class="menu-item">
          <a [routerLink]="[]" target="_blank" class="menu-link px-2">Comprar</a>
        </li>
      </ul>
    </div>
  `,
  imports: [ RouterModule ],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
