import { Component, model, ModelSignal, OnDestroy } from '@angular/core';
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductsService } from "src/app/products/products.config";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { CatalogMode, View } from "src/app/_models/base/types";
import { productCells } from "src/app/_models/products/productConstants";
import { ProductGridCardComponent } from "src/app/products/components/product-grid-card.component";

@Component({
  selector: 'div[productsGrid]',
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss',
  imports: [
    ProductGridCardComponent
  ],
})
export class ProductsGridComponent extends BaseTable<Product, ProductParams, ProductFiltersForm, ProductsService> implements TableInputSignals<Product, ProductParams> {
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
}
