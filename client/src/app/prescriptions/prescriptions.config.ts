import { Component, inject, NgModule, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, ResolveFn, Router, RouterModule } from "@angular/router";
import { CardComponent, LayoutModule } from "src/app/_shared/layout.module";
import { CatalogMode, FormUse, Role, Sections, View } from "src/app/_models/types";
import { PrescriptionsCatalogComponent } from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-catalog.component";
import { GuidService } from '../_services/guid.service';
import { CompactTableService } from '../_services/compact-table.service';
import { PrescriptionsService } from '../_services/prescriptions.service';
import { Prescription } from '../_models/prescription';
import { PrescriptionDetailsComponent } from './components/prescription-details/prescription-details.component';
import { PrescriptionEditComponent } from './components/prescription-edit/prescription-edit.component';
import { PrescriptionNewComponent } from './components/prescription-new/prescription-new.component';

@Component({
  selector: 'prescriptions-route',
  template: `
    <router-outlet></router-outlet>`,
})
export class PrescriptionsComponent implements OnInit {
  ngOnInit(): void { }
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
    this.label = this.prescription.dictionary.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

export const itemResolver: ResolveFn<Prescription | null> = (route, state) => {
  const prescription = inject(PrescriptionsService);
  const id = +route.paramMap.get('id')!;
  const edited = route.queryParamMap.get('edited');
  return prescription.getById(id, { noCache: edited ? true : false });
};

export const titleDetailResolver: ResolveFn<string> = (route, state) => {
  const prescription = inject(PrescriptionsService);
  const id = +route.paramMap.get('id')!;
  prescription.getById(id).subscribe();
  const item = prescription.getCurrent();
  if (!item) return 'Detalle de receta';
  const title = `Detalle de receta - ${item.id}`;
  return title;
}

export const titleEditResolver: ResolveFn<string> = (route, state) => {
  const prescription = inject(PrescriptionsService);
  const id = +route.paramMap.get('id')!;
  prescription.getById(id).subscribe();
  const item = prescription.getCurrent();
  if (!item) return 'Editar receta';
  const title = `Editar receta - ${item.id}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Recetas', data: { breadcrumb: 'Recetas', },
      component: PrescriptionsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de recetas', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: PrescriptionNewComponent, title: 'Crear nueva receta', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: PrescriptionDetailsComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/edit', title: titleEditResolver, data: { breadcrumb: 'Editar', },
          component: PrescriptionEditComponent,
          resolve: { item: itemResolver },
        },
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
