import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Notification } from "src/app/_models/notifications/notification";
import { notificationColumns, notificationDictionary } from "src/app/_models/notifications/notificationConstants";
import { NotificationParams } from "src/app/_models/notifications/notificationParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { NotificationsCatalogComponent } from "src/app/notifications/notifications-catalog.component";
import { NotificationFormComponent } from "src/app/notifications/notification-form.component";
import { Observable, Subject } from "rxjs";

@Component({
  selector: 'notifications-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          notificationsCatalog
          [embedded]="false"
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
  imports: [ NotificationsCatalogComponent, MaterialModule, CdkModule, ],
})
export class NotificationsCatalogModalComponent {
  data = inject<CatalogDialog<Notification, NotificationParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService extends ServiceHelper<Notification, NotificationParams, FormGroup2<NotificationParams>> {
  serverUpdate: Subject<void> = new Subject<void>();
  serverUpdate$: Observable<void> = this.serverUpdate.asObservable();

  constructor() {
    super(NotificationParams, 'notifications', notificationDictionary, notificationColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      NotificationsCatalogModalComponent,
      CatalogDialog<Notification, NotificationParams>
    >(NotificationsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new NotificationParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };

  getForUserByUserId(userId: number) {
    return this.http.get<Notification[]>(`${this.baseUrl}user/${userId}`);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.baseUrl}mark-as-read/${id}`, {});
  }

  toggleRead(id: number) {
    return this.http.put(`${this.baseUrl}toggle-read/${id}`, {});
  }

  toggleFavorite(id: number) {
    return this.http.put(`${this.baseUrl}toggle-favorite/${id}`, {});
  }

  toggleImportant(id: number) {
    return this.http.put(`${this.baseUrl}toggle-important/${id}`, {});
  }

  updateProducts(model: any, id: number) {
    return this.http.put<Notification>(`${this.baseUrl}update-products/${id}`, model);
  }
}

@Component({
  selector: 'notification-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          notificationForm
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
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, NotificationFormComponent, ],
})
export class NotificationDetailModalComponent {
  data: DetailDialog<Notification> = inject<DetailDialog<Notification>>(MAT_DIALOG_DATA);
}

