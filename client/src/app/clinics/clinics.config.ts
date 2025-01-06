import { CommonModule } from "@angular/common";
import { Component, effect, inject, Injectable, model, ModelSignal } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { ZipcodeAddressOption } from "src/app/_models/billingDetails";
import Clinic from "src/app/_models/clinics/clinic";
import { clinicDictionary, clinicColumns } from "src/app/_models/clinics/clinicConstants";
import ClinicFiltersForm from "src/app/_models/clinics/clinicFiltersForm";
import ClinicForm from "src/app/_models/clinics/clinicForm";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { DetailInputSignals, FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { ClinicsCatalogComponent } from "src/app/clinics/components/clinics-catalog.component";

@Component({
  selector: 'clinics-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      clinicsCatalog
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
  imports: [ClinicsCatalogComponent, MaterialModule, CdkModule,],
})
export class ClinicsCatalogModalComponent {
  data = inject<CatalogDialog<Clinic, ClinicParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class ClinicsService extends ServiceHelper<Clinic, ClinicParams, ClinicFiltersForm> {
  constructor() {
    super(ClinicParams, 'clinics',  clinicDictionary, clinicColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      ClinicsCatalogModalComponent,
      CatalogDialog<Clinic, ClinicParams>
    >(ClinicsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new ClinicParams(key),
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
    item: Clinic | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      ClinicDetailModalComponent,
      DetailDialog<Clinic>
    >(ClinicDetailModalComponent, {
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

  getAddressesByZipcode(zipcode: string) {
    return this.http.get<ZipcodeAddressOption[]>(`${this.baseUrl}zipcodes/${zipcode}`);
  }
}

@Component({
  selector: "[clinicForm]",
  templateUrl: './clinic-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class ClinicFormComponent
  extends BaseForm<Clinic, ClinicParams, ClinicFiltersForm, ClinicForm, ClinicsService>
  implements FormInputSignals<Clinic>
{
  item: ModelSignal<Clinic | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ClinicsService, ClinicForm);

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
  selector: 'div[clinicDetail]',
  template: `
  <div container3 [type]="'inline'">
    <!-- <div detailHeader [(use)]="use" [(view)]="view" [(dictionary)]="service.dictionary" [id]="item() !== null ? item()!.id : null" (onDelete)="service.delete$(item()!)"></div> -->
  </div>
  <div clinicForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [ClinicFormComponent, ControlsModule, Forms2Module,],
})
export class ClinicDetailComponent
  extends BaseDetail<Clinic, ClinicParams, ClinicFiltersForm, ClinicsService>
  implements DetailInputSignals<Clinic>
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Clinic | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(ClinicsService);
  }

}

@Component({
  selector: 'clinic-detail-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      clinicDetail
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
  imports: [ClinicDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class ClinicDetailModalComponent {
  data = inject<DetailDialog<Clinic>>(MAT_DIALOG_DATA);
}

