import { Component, inject, NgModule, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, ResolveFn, RouterModule } from "@angular/router";
import { CardComponent, LayoutModule } from "src/app/_shared/layout.module";
import { CatalogMode, FormUse, View } from "src/app/_models/types";
import { PrescriptionsCatalogComponent } from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-catalog.component";
import { PrescriptionFormComponent } from "src/app/prescriptions/components/prescription-form/prescription-form.component";
import { Prescription } from "src/app/_models/prescription";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { PrescriptionsService } from "src/app/_services/prescriptions.service";
import { createId } from "@paralleldrive/cuid2";

@Component({
  selector: 'prescriptions-route',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
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

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = createId();
  label: string;

  constructor() {
    this.label = this.prescription.dictionary.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'app-prescription-detail',
  template: `
@if (item()) {
<div prescriptionForm [(use)]="use" [(view)]="view" [(item)]="item"></div>
}
  `,
  standalone: true,
  imports: [PrescriptionFormComponent],
})
export class PrescriptionDetailComponent {
  private route = inject(ActivatedRoute);

  use = signal<FormUse>('detail');
  view = signal<View>('page');
  item = signal<Prescription | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.route.data.subscribe({
        next: (data) => {
          this.item = data['item'];
        },
      });
    }
  }
}

@Component({
  selector: 'app-prescription-edit',
  template: `
@if (item()) {
<div prescriptionForm [(use)]="use" [(view)]="view" [(item)]="item"></div>
}

  `,
  standalone: true,
  imports: [PrescriptionFormComponent],
})
export class PrescriptionEditComponent {
  private route = inject(ActivatedRoute);

  use = signal<FormUse>('edit');
  view = signal<View>('page');
  item = signal<Prescription | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.route.data.subscribe({
        next: (data) => {
          this.item = data['item'];
        },
      });
    }
  }
}

@Component({
  selector: 'app-prescription-new',
  template: `
    <div prescriptionForm [(use)]="use" [(view)]="view" [(item)]="item"></div>
  `,
  standalone: true,
  imports: [PrescriptionFormComponent, CommonModule,],
})
export class PrescriptionNewComponent {
  use = signal<FormUse>('create');
  view = signal<View>('page');
  item = signal<Prescription | null>(null);
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
          component: PrescriptionDetailComponent,
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
