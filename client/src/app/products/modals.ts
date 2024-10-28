import { CdkDrag } from "@angular/cdk/drag-drop";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { Product } from "src/app/_models/product";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";
import { ProductsFilterFormComponent } from "src/app/products/components/products-filter-form.component";
import { ProductDetailComponent } from "src/app/products/views";

@Component({
  standalone: true,
  selector: 'product-detail-modal',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }
      <mat-dialog-content>
        <div productDetailForm [id]="data.id" [use]="data.use" [view]="data.view" [key]="data.key" [item]="data.item"></div>
      </mat-dialog-content>
    </div>
  `,
  imports: [ProductDetailComponent, MatDialogTitle, MatDialogContent, CdkDrag ],
})
export class ProductDetailModalComponent {
  data = inject<DetailModal<Product>>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'products-filter-modal',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
    @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }
      <mat-dialog-content>
        <div productsFilterForm [formId]="data.formId" [key]="data.key"></div>
      </mat-dialog-content>
    </div>
  `,
  standalone: true,
  imports: [ProductsFilterFormComponent, MatDialogTitle, MatDialogContent, CdkDrag, ],
})
export class ProductsFilterModalComponent {
  data = inject<FilterModal>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'products-catalog-modal',
  template: `
      <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }

        <mat-dialog-content>
          <div productsCatalog [mode]="data.mode" [key]="data.key" [view]="data.view"></div>
        </mat-dialog-content>
      </div>
  `,
  standalone: true,
  imports: [ProductsCatalogComponent, MatDialogTitle, MatDialogContent, CdkDrag, ],
})
export class ProductsCatalogModalComponent {
  data = inject<CatalogModal>(MAT_DIALOG_DATA);
}
