import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Product } from "src/app/_models/products/product";
import { productDictionary, productColumns } from "src/app/_models/products/productConstants";
import { ProductParams } from "src/app/_models/products/productParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";
import { ProductFormComponent } from "src/app/products/product-form.component";

@Component({
  selector: 'products-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          productsCatalog
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
  imports: [ ProductsCatalogComponent, MaterialModule, CdkModule, ],
})
export class ProductsCatalogModalComponent {
  data = inject<CatalogDialog<Product, ProductParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ServiceHelper<Product, ProductParams, FormGroup2<ProductParams>> {
  constructor() {
    super(ProductParams, 'products', productDictionary, productColumns);
  }

  override update(model: any, id: number) {
    return this.http.put<Product>(`${this.baseUrl}${id}`, model);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      ProductsCatalogModalComponent,
      CatalogDialog<Product, ProductParams>
    >(ProductsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new ProductParams(key),
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
  selector: 'product-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          productForm
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
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, ProductFormComponent, ],
})
export class ProductDetailModalComponent {
  data = inject<DetailDialog<Product>>(MAT_DIALOG_DATA);
}
