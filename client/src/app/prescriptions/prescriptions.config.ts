import { Component, NgModule, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CardComponent, LayoutModule } from "src/app/_shared/layout.module";
import { FormUse, Role, View } from "src/app/_models/types";
import { PrescriptionNewComponent } from "src/app/prescriptions/prescription-new.component";
import { PrescriptionsCatalogComponent } from "src/app/prescriptions/prescriptions-catalog.component";

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
      <div prescriptionsCatalog></div>
    </div>`,
  standalone: true,
  imports: [CardComponent, PrescriptionsCatalogComponent]
})
export class CatalogComponent {
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Citas', data: { breadcrumb: 'Citas', },
      component: PrescriptionsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de citas', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nueva cita', data: { breadcrumb: 'Nuevo', }, },
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
