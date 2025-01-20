import { CommonModule } from "@angular/common";
import { Component, ModelSignal, model, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import { Product } from "src/app/_models/products/product";
import { productCells } from "src/app/_models/products/productConstants";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductParams } from "src/app/_models/products/productParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { ProductsService } from "src/app/products/products.config";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoShape } from "src/app/_models/photos/photoTypes";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[productsTable]',
  templateUrl: './products-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    TableMenuComponent,
    SymbolCellComponent,
  ],
})
export class ProductsTableComponent extends BaseTable<Product, ProductParams, ProductFiltersForm, ProductsService> implements OnDestroy, TableInputSignals<Product, ProductParams> {
  item: ModelSignal<Product | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ProductParams> = model.required();
  data: ModelSignal<Product[]> = model.required();

  constructor() {
    super(ProductsService, Product, { tableCells: productCells, });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private updateProduct(item: Product): void {
    this.service.update(item, item.id, "inline").subscribe({
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  handleIsEnabledChange(item: Product, checked: boolean): void {
    item.isEnabled = checked;
    this.updateProduct(item);
  }

  handleIsVisibleChange(item: Product, checked: boolean): void {
    item.isVisible = checked;
    this.updateProduct(item);
  }

  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
}
