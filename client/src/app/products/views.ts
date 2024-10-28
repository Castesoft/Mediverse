import { Component, input, model } from "@angular/core";
import { FormUse, View } from "src/app/_models/types";
import { Product } from "src/app/_models/product";
import { ProductFormComponent } from "src/app/products/components/product-form.component";
import { ProductHeaderComponent } from "src/app/products/components/product-header.component";


@Component({
  selector: 'div[productDetailForm]',
  template: `
  `,
  standalone: true,
  imports: [ProductFormComponent, ProductHeaderComponent],
})
export class ProductDetailComponent {
  use = model.required<FormUse>();
  view = model.required<View>();
  item = model.required<Product | null>();
  key = model.required<string | null>();
}
