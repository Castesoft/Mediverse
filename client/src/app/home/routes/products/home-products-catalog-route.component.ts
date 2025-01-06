import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Product } from "src/app/_models/products/product";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductsService } from "src/app/products/products.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeProductsCatalogRoute]',
  // selector: 'home-products-catalog-route',
  templateUrl: './home-products-catalog-route.component.html',
  standalone: false,
})
export class HomeProductsCatalogRouteComponent
  extends BaseRouteCatalog<Product, ProductParams, ProductFiltersForm, ProductsService>
{

  constructor() {
    super(ProductsService, 'products');
  }

}
