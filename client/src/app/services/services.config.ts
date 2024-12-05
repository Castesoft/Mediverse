import { CommonModule } from "@angular/common";
import { Component, effect, inject, Injectable, model, ModelSignal, NgModule } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import { BaseForm, BaseDetail, BaseRouteCatalog, BaseRouteDetail, createItemResolver } from "src/app/_models/forms/extensions/baseFormComponent";
import { FormInputSignals, DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Service } from "src/app/_models/services/service";
import { serviceDictionary, serviceColumns } from "src/app/_models/services/serviceConstants";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ServiceForm } from "src/app/_models/services/serviceForm";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { CatalogModalType, DetailModalType } from "src/app/_shared/table/table.module";
import { BreadcrumbsModule } from "src/app/_utils/breadcrumbs.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { ServicesCatalogComponent } from "src/app/services/components/services-catalog.component";

@Component({
  selector: 'services-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      servicesCatalog
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
  imports: [ServicesCatalogComponent, MaterialModule, CdkModule,],
})
export class ServicesCatalogModalComponent {
  data = inject<CatalogModalType<Service, ServiceParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService extends ServiceHelper<Service, ServiceParams, ServiceFiltersForm> {
  constructor() {
    super(ServiceParams, 'services', serviceDictionary, serviceColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      ServicesCatalogModalComponent,
      CatalogModalType<Service, ServiceParams>
    >(ServicesCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new ServiceParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };

  clickLink(
    item: Service | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      ServiceDetailModalComponent,
      DetailModalType<Service>
    >(ServiceDetailModalComponent, {
      data: {
        item: item,
        key: key,
        use: use,
        view: 'modal',
        title: this.getFormHeaderText(use, item),
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ 'window' ]
    });

  } else {
    switch (use) {
      case 'create':
        this.router.navigate([this.dictionary.createRoute]);
        break;
      case 'edit':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}/editar`]);
        break;
      case 'detail':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  }
}

@Component({
  selector: "[serviceForm]",
  // template: ``,
  templateUrl: './service-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class ServiceFormComponent
  extends BaseForm<
    Service, ServiceParams, ServiceFiltersForm, ServiceForm, ServicesService
  >
  implements FormInputSignals<Service> {
  item: ModelSignal<Service | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ServicesService, ServiceForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }
}

@Component({
  selector: 'div[serviceDetail]',
  template: `
  <div container3 [type]="'inline'">
    <div detailHeader [(use)]="use" [(view)]="view" [dictionary]="service.dictionary" [id]="$any(item() !== null ? item()!.id : null)" (onDelete)="service.delete$(item()!)"></div>
  </div>
  <div serviceForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [ServiceFormComponent, ControlsModule, Forms2Module,],
})
export class ServiceDetailComponent
  extends BaseDetail<Service, ServiceParams, ServiceFiltersForm, ServicesService>
  implements DetailInputSignals<Service>
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Service | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(ServicesService);
  }

}

@Component({
  selector: 'service-detail-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      serviceDetail
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
  imports: [ServiceDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class ServiceDetailModalComponent {
  data = inject<DetailModalType<Service>>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'services-route',
  standalone: false,
  template: `<router-outlet></router-outlet>`,
})
export class ServicesComponent {}

@Component({
  selector: 'services-catalog-route',
  template: `
  <div servicesCatalog [(mode)]="mode" [(key)]="key" [(view)]="view" [(isCompact)]="compact.isCompact" [(item)]="item" [(params)]="params"></div>
  `,
  standalone: true,
  imports: [RouterModule, ServicesCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent extends BaseRouteCatalog<Service, ServiceParams, ServiceFiltersForm, ServicesService> {
  constructor() {
    super(ServicesService, 'services');

    effect(() => {

    });
  }
}

@Component({
  selector: 'service-detail-route',
  template: `<div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [RouterModule, ServiceDetailComponent, BreadcrumbsModule,],
})
export class DetailComponent extends BaseRouteDetail<Service> {
  constructor() {
    super('services', 'detail');

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
  selector: 'service-edit-route',
  template: `<div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ServiceDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class EditComponent extends BaseRouteDetail<Service> {
  constructor() {
    super('services', 'edit');

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
  selector: 'service-new-route',
  template: `<div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ServiceDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class NewComponent extends BaseRouteDetail<Service> {
  constructor() {
    super('services', 'create');

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
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ganaderías', data: { breadcrumb: 'Ganaderías', },
      component: ServicesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ganaderías', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nueva ganadería', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: createItemResolver(ServicesService) },
        },
        {
          path: ':id/editar', data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: createItemResolver(ServicesService) },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }

@NgModule({
  declarations: [
    ServicesComponent,
  ],
  imports: [ CommonModule, ServicesRoutingModule, ]
})
export class ServicesModule { }

