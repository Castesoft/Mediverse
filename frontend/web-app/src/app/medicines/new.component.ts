import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MedicineNewComponent } from './components/medicine-new.component';

@Component({
  selector: 'medicines-new-route',
  template: `
    <div class="toolbar" id="kt_toolbar">
      <div class="container-fluid d-flex flex-stack flex-wrap flex-sm-nowrap">
        <div
          class="d-flex flex-column align-items-start justify-content-center flex-wrap me-2"
        >
          <h1 class="text-gray-900 fw-bold my-1 fs-2">
            Recetas
            <small class="text-muted fs-6 fw-normal ms-1"></small>
          </h1>
          <ul class="breadcrumb fw-semibold fs-base my-1">
            <li class="breadcrumb-item text-muted">
              <a [routerLink]="'../../'" class="text-muted text-hover-primary"
                >Dashboard</a
              >
            </li>
            <li class="breadcrumb-item text-muted">
              <a [routerLink]="'../'" class="text-muted text-hover-primary"
                >Recetas</a
              >
            </li>
            <li class="breadcrumb-item text-muted">Agregar</li>
          </ul>
        </div>
      </div>
    </div>

    <div medicinesNew></div>
  `,
  standalone: true,
  imports: [MedicineNewComponent, RouterModule],
})
export class NewComponent {}
