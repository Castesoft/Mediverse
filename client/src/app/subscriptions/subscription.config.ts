import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { SubscriptionsCatalogComponent } from "src/app/subscriptions/subscriptions-catalog.component";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { SubscriptionParams } from "src/app/_models/subscriptions/subscriptionParams";
import { SubscriptionFormComponent } from "src/app/subscriptions/subscription-form.component";
import { SubscriptionFiltersForm } from "src/app/_models/subscriptions/subscriptionFiltersForm";
import { subscriptionColumns, subscriptionDictionary } from "src/app/_models/subscriptions/subscriptionConstants";

@Component({
  selector: 'subscriptions-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          subscriptionsCatalog
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
  imports: [ SubscriptionsCatalogComponent, MaterialModule, CdkModule, ],
})
export class SubscriptionsCatalogModalComponent {
  data = inject<CatalogDialog<Subscription, SubscriptionParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService extends ServiceHelper<Subscription, SubscriptionParams, SubscriptionFiltersForm> {
  constructor() {
    super(SubscriptionParams, 'subscriptions', subscriptionDictionary, subscriptionColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      SubscriptionsCatalogModalComponent,
      CatalogDialog<Subscription, SubscriptionParams>
    >(SubscriptionsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new SubscriptionParams(key),
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
  selector: 'subscriptions-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          subscriptionForm
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
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, SubscriptionFormComponent, ],
})
export class SubscriptionDetailModalComponent {
  data = inject<DetailDialog<Subscription>>(MAT_DIALOG_DATA);
}
