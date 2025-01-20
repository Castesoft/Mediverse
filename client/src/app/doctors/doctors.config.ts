import {
  Component,
  inject,
  Injectable
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Doctor } from "src/app/_models/doctors/doctor";
import { DoctorParams } from "src/app/_models/doctors/doctorParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { DoctorsCatalogComponent } from "src/app/doctors/doctors-catalog.component";
import { DoctorFormComponent } from "src/app/doctors/doctor-form.component";

@Component({
  selector: 'doctors-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          doctorsCatalog
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
  imports: [ DoctorsCatalogComponent, MaterialModule, CdkModule, ],
})
export class DoctorsCatalogModalComponent {
  data = inject<CatalogDialog<Doctor, DoctorParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class DoctorsService extends ServiceHelper<Doctor, DoctorParams, FormGroup2<DoctorParams>> {
  constructor() {
    super(DoctorParams, 'doctors', doctorDictionary, doctorColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      DoctorsCatalogModalComponent,
      CatalogDialog<Doctor, DoctorParams>
    >(DoctorsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new DoctorParams(key),
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
  selector: 'doctor-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          doctorForm
          [(use)]="data.use"
          [(view)]="data.view"
          [(key)]="data.key"
          [(item)]="data.item"
        ></div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cerrar</button>
      </mat-dialog-actions>
    }
  `,
  standalone: true,
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, DoctorFormComponent, ],
})
export class DoctorDetailModalComponent {
  data: DetailDialog<Doctor> = inject<DetailDialog<Doctor>>(MAT_DIALOG_DATA);
}

