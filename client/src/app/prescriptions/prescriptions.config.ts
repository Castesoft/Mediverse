import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal, NgModule } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import BaseRouteDetail from "src/app/_models/base/components/extensions/routes/baseRouteDetail";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { View } from "src/app/_models/base/types";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { BreadcrumbsModule } from "src/app/_utils/breadcrumbs.module";
import createItemResolver from "src/app/_utils/serviceHelper/functions/createItemResolver";
import {
  PrescriptionFormComponent
} from "src/app/prescriptions/components/prescription-form/prescription-form.component";
import {
  PrescriptionsCatalogComponent
} from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-catalog.component";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.service";

@Component({
  selector: 'prescriptions-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          prescriptionsCatalog
          [(mode)]="data.mode"
          [(key)]="data.key"
          [(view)]="data.view"
          [(isCompact)]="data.isCompact"
          [(item)]="data.item"
          [(params)]="data.params"
        ></div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cerrar</button>
      </mat-dialog-actions>
    }
  `,
  standalone: true,
  imports: [ PrescriptionsCatalogComponent, MaterialModule, CdkModule, ],
})
export class PrescriptionsCatalogModalComponent {
  data = inject<CatalogDialog<Prescription, PrescriptionParams>>(MAT_DIALOG_DATA);
}


@Component({
  selector: 'div[prescriptionDetail]',
  template: `
    <div prescriptionForm
         [(item)]="item"
         [(key)]="key"
         [(use)]="use"
         [(view)]="view"></div>
  `,
  imports: [
    PrescriptionFormComponent,
    ControlsModule,
    Forms2Module,
    PrescriptionFormComponent,
  ],
})
export class PrescriptionDetailComponent extends BaseDetail<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService> implements DetailInputSignals<Prescription> {
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Prescription | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(PrescriptionsService);
  }
}

@Component({
  selector: 'prescription-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          prescriptionDetail
          [(use)]="data.use"
          [(view)]="data.view"
          [(key)]="data.key"
          [(item)]="data.item"
          [(title)]="data.title"
        ></div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cerrar</button>
      </mat-dialog-actions>
    }
  `,
  standalone: true,
  imports: [ PrescriptionDetailComponent, ModalWrapperModule, MaterialModule, CdkModule, ],
})
export class PrescriptionDetailModalComponent {
  data = inject<DetailDialog<Prescription>>(MAT_DIALOG_DATA);
}


@Component({
  selector: 'prescriptions-route',
  standalone: false,
  template: `
    <router-outlet></router-outlet>
  `,
})
export class PrescriptionsComponent {}

@Component({
  selector: 'prescriptions-catalog-route',
  template: `
    <div
      prescriptionsCatalog
      [(mode)]="mode"
      [(key)]="key"
      [(view)]="view"
      [(isCompact)]="compact.isCompact"
      [(item)]="item"
      [(params)]="params"
    ></div>
  `,
  standalone: true,
  imports: [ RouterModule, PrescriptionsCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent extends BaseRouteCatalog<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService> {
  constructor() {
    super(PrescriptionsService, 'prescriptions');

    effect(() => {
      console.log('key', this.key());
    });
  }
}

@Component({
  selector: 'prescription-detail-route',
  template: `
    <div prescriptionDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  standalone: true,
  imports: [ RouterModule, PrescriptionDetailComponent, BreadcrumbsModule, ],
})
export class DetailComponent extends BaseRouteDetail<Prescription> {
  constructor() {
    super('prescriptions', FormUse.DETAIL);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
          console.log('item', this.item());
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'prescription-edit-route',
  template: `
    <div prescriptionDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  standalone: true,
  imports: [ PrescriptionDetailComponent, RouterModule, BreadcrumbsModule, ],
})
export class EditComponent extends BaseRouteDetail<Prescription> {
  constructor() {
    super('prescriptions', FormUse.EDIT);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'prescription-new-route',
  template: `
    <div prescriptionDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  standalone: true,
  imports: [ PrescriptionDetailComponent, RouterModule, BreadcrumbsModule, ],
})
export class NewComponent extends BaseRouteDetail<Prescription> {
  constructor() {
    super('prescriptions', FormUse.CREATE);

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '', title: 'Ganaderías', data: { breadcrumb: 'Ganaderías', },
      component: PrescriptionsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ganaderías', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nueva ganadería', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: createItemResolver(PrescriptionsService) },
        },
        {
          path: ':id/editar', data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: createItemResolver(PrescriptionsService) },
        },
      ],
    },
  ]) ],
  exports: [ RouterModule ]
})
export class PrescriptionsRoutingModule {}

@NgModule({
  declarations: [
    PrescriptionsComponent,
  ],
  imports: [ CommonModule, PrescriptionsRoutingModule, ]
})
export class PrescriptionsModule {}
