import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";
import { DoctorAssociationParams } from "src/app/_models/doctorAssociations/doctorAssociationParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import {
  doctorAssociationColumnsDoctorView,
  doctorAssociationDictionary
} from "src/app/_models/doctorAssociations/doctorAssociationConstants";
import { CatalogMode, View } from "src/app/_models/base/types";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { firstValueFrom, tap } from "rxjs";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import { Modal } from "src/app/_models/modal";
import {
  DoctorAssociationsCatalogComponent
} from "src/app/account/components/account-doctor-associations/doctors-associations-catalog/doctors-associations-catalog.component";

@Component({
  selector: 'doctors-associations-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          doctorsAssociationsCatalog
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
  imports: [ DoctorAssociationsCatalogComponent, MaterialModule, CdkModule ],
})
export class DoctorAssociationsCatalogModalComponent {
  data = inject<CatalogDialog<DoctorAssociation, DoctorAssociationParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class DoctorAssociationsService extends ServiceHelper<DoctorAssociation, DoctorAssociationParams, FormGroup2<DoctorAssociationParams>> {
  private readonly confirmService: ConfirmService = inject(ConfirmService);

  constructor() {

    super(DoctorAssociationParams, 'doctorNurses', doctorAssociationDictionary, doctorAssociationColumnsDoctorView);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      DoctorAssociationsCatalogModalComponent,
      CatalogDialog<DoctorAssociation, DoctorAssociationParams>
    >(DoctorAssociationsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new DoctorAssociationParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };


  async removeAssociation(doctorId: number, nurseId: number): Promise<void> {
    const confirmed = await firstValueFrom(this.confirm.confirm(new Modal({
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar la asociación entre el doctor ID ${doctorId} y el especialista ID ${nurseId}?`,
      btnOkText: 'Eliminar',
      btnCancelText: 'Cancelar',
      btnColor: 'danger'
    })));

    if (!confirmed) return;

    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}doctor/${doctorId}/nurse/${nurseId}`)
      .pipe(
        tap(() => {
          this.toastr.success('Asociación eliminada correctamente.');
        }),
      )
    );
  }
}
