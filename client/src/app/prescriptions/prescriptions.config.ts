import { Component, inject, NgModule, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CardComponent, LayoutModule } from "src/app/_shared/layout.module";
import { CatalogMode, FormUse, Role, View } from "src/app/_models/types";
import { PrescriptionNewComponent } from "src/app/prescriptions/components/prescription-new.component";
import { PrescriptionsCatalogComponent } from "src/app/prescriptions/components/prescriptions-catalog.component";
import { GuidService } from '../_services/guid.service';
import { CompactTableService } from '../_services/compact-table.service';
import { PrescriptionsService } from '../_services/prescriptions.service';

@Component({
  selector: 'prescriptions-route',
  template: `
    <router-outlet></router-outlet>`,
})
export class PrescriptionsComponent implements OnInit {
  ngOnInit(): void { }
}

@Component({
  selector: 'prescription-new-route',
  template: `
    <div [role]="role" [use]="use" [view]="view" prescriptionNewView></div>
  `,
  standalone: true,
  imports: [PrescriptionNewComponent, RouterModule, LayoutModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  role: Role = 'Patient';
}

@Component({
  selector: 'prescription-catalog-route',
  template: `
    <div card>
      <div prescriptionsCatalog
        [mode]="mode"
        [key]="key"
        [view]="view"
      ></div>
    </div>`,
  standalone: true,
  imports: [CardComponent, PrescriptionsCatalogComponent]
})
export class CatalogComponent {
  prescription = inject(PrescriptionsService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  label: string;

  constructor() {
    this.label = this.prescription.naming.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Recetas', data: { breadcrumb: 'Recetas', },
      component: PrescriptionsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de recetas', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nueva receta', data: { breadcrumb: 'Nuevo', }, },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class PrescriptionsRoutingModule {
}

@NgModule({
  declarations: [
    PrescriptionsComponent,
  ],
  imports: [CommonModule, PrescriptionsRoutingModule, LayoutModule,]
})
export class PrescriptionsModule {
}
