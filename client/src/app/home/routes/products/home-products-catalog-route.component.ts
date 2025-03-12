import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Product } from "src/app/_models/products/product";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductsService } from "src/app/products/products.config";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[homeProductsCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div productsCatalog
           [(item)]="item"
           [(isCompact)]="compact.isCompact"
           [(key)]="key"
           [(mode)]="mode"
           [(params)]="params"
           [(view)]="view"></div>
    </div>
  `,
  standalone: false,
})
export class HomeProductsCatalogRouteComponent extends BaseRouteCatalog<Product, ProductParams, ProductFiltersForm, ProductsService> {
  constructor() {
    super(ProductsService, 'products');
    this.params().fromSection = SiteSection.HOME;
  }
}
