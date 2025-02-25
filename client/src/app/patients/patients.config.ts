import { CommonModule } from "@angular/common";
import { Component, effect, inject, Injectable, InputSignal, model, ModelSignal } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Patient } from "src/app/_models/patients/patient";
import { patientColumns, patientDictionary } from "src/app/_models/patients/patientConstants";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientForm } from "src/app/_models/patients/patientForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { PatientDetailComponent } from "src/app/patients/components/patient-detail.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { PatientsTableComponent } from "src/app/patients/components/patients-table.component";

@Component({
  selector: 'patients-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div catalogLayout
             [form]="form"
             [service]="service"
             [(mode)]="data.mode"
             [(key)]="data.key"
             [(view)]="data.view"
             [(isCompact)]="data.isCompact"
             [(item)]="data.item"
             [(params)]="data.params"
        >
          <ng-template #entityTable let-list="list">
            <table patientsTable
                   [(mode)]="data.mode"
                   [(isCompact)]="data.isCompact"
                   [data]="list"
                   [(key)]="data.key"
                   [(view)]="data.view"
                   [(item)]="data.item"
                   [(params)]="data.params">
            </table>
          </ng-template>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cerrar</button>
      </mat-dialog-actions>
    }
  `,
  standalone: true,
  imports: [ MaterialModule, CdkModule, GenericCatalogComponent, PatientsTableComponent, ],
})
export class PatientsCatalogModalComponent {
  service = inject(PatientsService);
  form = new PatientFiltersForm();
  data = inject<CatalogDialog<Patient, PatientParams>>(MAT_DIALOG_DATA);
}

@Component({
  selector: "[patientForm]",
  templateUrl: './patient-form.component.html',
  standalone: true,
  imports: [ CommonModule, RouterModule, ControlsModule, Forms2Module, ]
})
export class PatientFormComponent
  extends BaseForm<Patient, PatientParams, PatientFiltersForm, PatientForm, PatientsService>
  implements FormInputSignals<Patient>
{
  item: ModelSignal<Patient | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = model(true);

  constructor() {
    super(PatientsService, PatientForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) this.form.patchValue(this.item()! as any);
    });
  }

  protected readonly FormUse = FormUse;
}

@Component({
  selector: 'patient-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          patientDetail
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
  imports: [ PatientDetailComponent, ModalWrapperModule, MaterialModule, CdkModule, ],
})
export class PatientDetailModalComponent {
  data = inject<DetailDialog<Patient>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class PatientsService extends ServiceHelper<Patient, PatientParams, PatientFiltersForm> {
  constructor() {
    super(PatientParams, 'patients', patientDictionary, patientColumns, PatientDetailModalComponent);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      PatientsCatalogModalComponent,
      CatalogDialog<Patient, PatientParams>
    >(PatientsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new PatientParams(key),
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
