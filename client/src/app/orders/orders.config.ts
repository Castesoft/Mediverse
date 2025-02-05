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
import { Order } from "src/app/_models/orders/order";
import { orderDictionary, orderColumns } from "src/app/_models/orders/orderConstants";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { OrdersCatalogComponent } from "src/app/orders/orders-catalog.component";
import { OrderFormComponent } from "src/app/orders/order-form.component";
import { OrderHistory } from "src/app/_models/orders/orderHistory";

@Component({
  selector: 'orders-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          ordersCatalog
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
  imports: [ OrdersCatalogComponent, MaterialModule, CdkModule, ],
})
export class OrdersCatalogModalComponent {
  data = inject<CatalogDialog<Order, OrderParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends ServiceHelper<Order, OrderParams, FormGroup2<OrderParams>> {
  constructor() {
    super(OrderParams, 'orders', orderDictionary, orderColumns);
  }

  getHistory(id: number) {
    return this.http.get<OrderHistory[]>(`${this.baseUrl}${id}/history`);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      OrdersCatalogModalComponent,
      CatalogDialog<Order, OrderParams>
    >(OrdersCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new OrderParams(key),
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
  selector: 'order-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          orderForm
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
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, OrderFormComponent, ],
})
export class OrderDetailModalComponent {
  data: DetailDialog<Order> = inject<DetailDialog<Order>>(MAT_DIALOG_DATA);
}

