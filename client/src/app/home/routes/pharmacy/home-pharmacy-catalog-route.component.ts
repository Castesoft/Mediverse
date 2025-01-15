import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductsService } from "src/app/products/products.config";

@Component({
  selector: 'div[homePatientsCatalogRoute]',
  templateUrl: './home-pharmacy-catalog-route.component.html',
  standalone: false,
})
export class HomePharmacyCatalogRouteComponent extends BaseRouteCatalog<Product, ProductParams, ProductFiltersForm, ProductsService> {
  constructor() {
    super(ProductsService, 'products');
  }
}
