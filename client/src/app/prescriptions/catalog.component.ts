import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrescriptionsCatalogComponent } from './components/prescriptions-catalog.component';
import { CompactTableService } from '../_services/compact-table.service';

@Component({
  selector: 'prescriptions-catalog-route',
  standalone: true,
  imports: [ PrescriptionsCatalogComponent, RouterModule, ],
  template: `
    <nav class="mb-2" [attr.aria-label]="ariaLabel">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a routerLink="/admin">Admin</a></li>
        <li class="breadcrumb-item"><a routerLink="/admin/mantenimiento">Mantenimiento</a></li>
        <li class="breadcrumb-item active" [attr.aria-current]="ariaCurrent">
          {{ subject }}
        </li>
      </ol>
    </nav>
    <div prescriptionsCatalogView [isCompact]="isCompact" [mode]="'view'"></div>
  `,
})
export class CatalogComponent implements OnInit {
  compact = inject(CompactTableService);

  subject = 'Prescripcións';
  ariaCurrent = 'Catálogo de prescripcions';
  ariaLabel = 'Breadcrumb';

  isCompact = false;

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: mode => this.isCompact = mode });
  }

}
