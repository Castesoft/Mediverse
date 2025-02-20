import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { User } from "src/app/_models/users/user";
import { userDictionary, userColumns } from "src/app/_models/users/userConstants";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UserParams } from "src/app/_models/users/userParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { UserDetailComponent } from "src/app/users/components/user-detail.component";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";
import { ClinicalHistoryVerification } from "src/app/_models/clinicalHistoryVerification";

@Component({
  selector: 'users-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          usersCatalog
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
  imports: [ UsersCatalogComponent, MaterialModule, CdkModule, ],
})
export class UsersCatalogModalComponent {
  data: CatalogDialog<User, UserParams> = inject<CatalogDialog<User, UserParams>>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'user-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          userDetail
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
  imports: [ UserDetailComponent, ModalWrapperModule, MaterialModule, CdkModule, ],
})
export class UserDetailModalComponent {
  data: DetailDialog<User> = inject<DetailDialog<User>>(MAT_DIALOG_DATA);
}


@Injectable({
  providedIn: "root",
})
export class UsersService extends ServiceHelper<User, UserParams, UserFiltersForm> {
  constructor() {
    super(UserParams, 'users', userDictionary, userColumns);
  }

  getClinicalHistoryConsentStatus(doctorId: number, patientId: number) {
    return this.http.get<ClinicalHistoryVerification>(`${this.baseUrl}clinical-history-verification/patient/${patientId}/doctor/${doctorId}`);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      UsersCatalogModalComponent,
      CatalogDialog<User, UserParams>
    >(UsersCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new UserParams(key),
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
