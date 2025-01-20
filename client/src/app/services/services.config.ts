import { CommonModule } from "@angular/common";
import { Component, inject, Injectable, ModelSignal, model, effect } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { FormInputSignals, DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Service } from "src/app/_models/services/service";
import { serviceDictionary, serviceColumns } from "src/app/_models/services/serviceConstants";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ServiceForm } from "src/app/_models/services/serviceForm";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
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
  data = inject<CatalogDialog<Service, ServiceParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService extends ServiceHelper<Service, ServiceParams, FormGroup2<ServiceParams>> {
  constructor() {
    super(ServiceParams, 'services', serviceDictionary, serviceColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      ServicesCatalogModalComponent,
      CatalogDialog<Service, ServiceParams>
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

}

@Component({
  selector: "[serviceForm]",
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
    <!-- <div detailHeader [(use)]="use" [(view)]="view" [(dictionary)]="service.dictionary" [id]="item() !== null ? item()!.id : null" (onDelete)="service.delete$(item()!)"></div> -->
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
  data = inject<DetailDialog<Service>>(MAT_DIALOG_DATA);
}
