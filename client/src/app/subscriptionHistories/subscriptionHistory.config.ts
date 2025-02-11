import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import {
  SubscriptionHistoryHistoriesCatalogComponent
} from "src/app/subscriptionHistories/subscriptionHistories-catalog.component";
import { SubscriptionHistoryParams } from "src/app/_models/subscriptionHistories/subscriptionHistoryParams";
import {
  subscriptionHistoryColumns,
  subscriptionHistoryDictionary
} from "src/app/_models/subscriptionHistories/subscriptionHistoryConstants";
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { SubscriptionHistoryFiltersForm } from "src/app/_models/subscriptionHistories/subscriptionHistoryFiltersForm";
import { SubscriptionHistoryFormComponent } from "src/app/subscriptionHistories/subscriptionHistory-form.component";

@Component({
  selector: 'subscriptionHistories-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          subscriptionHistoriesCatalog
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
  imports: [ MaterialModule, CdkModule, SubscriptionHistoryHistoriesCatalogComponent, ],
})
export class SubscriptionHistoriesCatalogModalComponent {
  data = inject<CatalogDialog<SubscriptionHistory, SubscriptionHistoryParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionHistoriesService extends ServiceHelper<SubscriptionHistory, SubscriptionHistoryParams, SubscriptionHistoryFiltersForm> {
  constructor() {
    super(SubscriptionHistoryParams, 'subscriptionHistories', subscriptionHistoryDictionary, subscriptionHistoryColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      SubscriptionHistoriesCatalogModalComponent,
      CatalogDialog<SubscriptionHistory, SubscriptionHistoryParams>
    >(SubscriptionHistoriesCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new SubscriptionHistoryParams(key),
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
  selector: 'subscriptionHistories-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          subscriptionHistoryForm
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
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, SubscriptionHistoryFormComponent, ],
})
export class SubscriptionHistoryDetailModalComponent {
  data = inject<DetailDialog<SubscriptionHistory>>(MAT_DIALOG_DATA);
}
