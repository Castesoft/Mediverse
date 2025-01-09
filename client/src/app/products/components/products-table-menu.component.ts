import { Component, model, ModelSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CdkModule } from "../../_shared/cdk.module";
import { MaterialModule } from "../../_shared/material.module";
import { TableMenu } from "../../_models/tables/extensions/tableComponentExtensions";
import { ProductsService } from "../products.config";
import { ITableMenu } from "../../_models/tables/interfaces/tableComponentInterfaces";
import { Product } from "../../_models/products/product";

@Component({
  selector: 'div[productsTableMenu]',
  host: { class: '' },
  templateUrl: './products-table-menu.component.html',
  standalone: true,
  imports: [ RouterModule, CdkModule, MaterialModule ],
})
export class ProductsTableMenuComponent extends TableMenu<ProductsService> implements ITableMenu<Product> {
  item: ModelSignal<Product> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ProductsService);
  }
}
