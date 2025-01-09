import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { ProductsService } from "../../../products/products.config";
import { Product } from "../../../_models/products/product";
import { ProductParams } from "../../../_models/products/productParams";
import { ProductFiltersForm } from "../../../_models/products/productFiltersForm";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homePatientsCatalogRoute]',
  templateUrl: './home-pharmacy-catalog-route.component.html',
  standalone: false,
})
export class HomePharmacyCatalogRouteComponent extends BaseRouteCatalog<Product, ProductParams, ProductFiltersForm, ProductsService> {
  constructor() {
    super(ProductsService, 'products');
  }
}
