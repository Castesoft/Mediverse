import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductsService } from "src/app/products/products.config";
import { ProductTableDisplayMode } from "src/app/_models/products/productTableDisplayMode";

@Component({
  selector: 'div[homePharmacyCatalogRouteComponent]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div productsCatalog [(item)]="item" [(isCompact)]="compact.isCompact" [(key)]="key" [(mode)]="mode"
           [(params)]="params" [(view)]="view" [tableMode]="ProductTableDisplayMode.Grid" [useCard]="false"
           [hideAddButton]="true"></div>
    </div>
  `,
  standalone: false,
})
export class HomePharmacyCatalogRouteComponent extends BaseRouteCatalog<Product, ProductParams, ProductFiltersForm, ProductsService> {
  protected readonly ProductTableDisplayMode: typeof ProductTableDisplayMode = ProductTableDisplayMode;

  constructor() {
    super(ProductsService, 'products');
    this.params().isInternal = true;
    this.params().pageSize = 12;
  }
}
