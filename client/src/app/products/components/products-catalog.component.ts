import { Component, ModelSignal, model, inject } from "@angular/core";
import { View, CatalogMode, } from "src/app/_models/base/types";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductsTableComponent } from "src/app/products/components/products-table.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { ProductsService } from "src/app/products/products.config";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { FilterConfiguration } from "../../_models/base/filter-types";
import { ProductTableDisplayMode } from "src/app/_models/products/productTableDisplayMode";
import { ProductsGridComponent } from "src/app/products/components/products-grid.component";

@Component({
  selector: '[productsCatalog]',
  templateUrl: './products-catalog.component.html',
  imports: [ ProductsTableComponent, GenericCatalogComponent, ControlsRow3Component, ControlsWrapper3Component, FormsModule, ProductsGridComponent ],
  standalone: true,
})
export class ProductsCatalogComponent {
  protected readonly ProductTableDisplayMode: typeof ProductTableDisplayMode = ProductTableDisplayMode;

  item: ModelSignal<Product | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ProductParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());
  tableMode: ModelSignal<ProductTableDisplayMode> = model(ProductTableDisplayMode.Table as ProductTableDisplayMode);
  hideAddButton: ModelSignal<boolean> = model(false);
  useCard: ModelSignal<boolean> = model(true);

  service: ProductsService = inject(ProductsService);
  form: ModelSignal<ProductFiltersForm> = model(new ProductFiltersForm());
}
