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
import { Warehouse } from "src/app/_models/warehouses/warehouse";
import { warehouseDictionary, warehouseColumns } from "src/app/_models/warehouses/warehouseConstants";
import { WarehouseParams } from "src/app/_models/warehouses/warehouseParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { WarehousesCatalogComponent } from "src/app/warehouses/warehouses-catalog.component";
import { WarehouseFormComponent } from "src/app/warehouses/warehouse-form.component";
import { Product } from "src/app/_models/products/product";

@Component({
  selector: 'warehouses-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          warehousesCatalog
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
  imports: [ WarehousesCatalogComponent, MaterialModule, CdkModule, ],
})
export class WarehousesCatalogModalComponent {
  data = inject<CatalogDialog<Warehouse, WarehouseParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class WarehousesService extends ServiceHelper<Warehouse, WarehouseParams, FormGroup2<WarehouseParams>> {
  constructor() {
    super(WarehouseParams, 'warehouses', warehouseDictionary, warehouseColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      WarehousesCatalogModalComponent,
      CatalogDialog<Warehouse, WarehouseParams>
    >(WarehousesCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new WarehouseParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };

  updateProducts(model: any, id: number) {
    return this.http.put<Warehouse>(`${this.baseUrl}update-products/${id}`, model);
  }
}

@Component({
  selector: 'warehouse-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          warehouseForm
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
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, WarehouseFormComponent, ],
})
export class WarehouseDetailModalComponent {
  data: DetailDialog<Warehouse> = inject<DetailDialog<Warehouse>>(MAT_DIALOG_DATA);
}

