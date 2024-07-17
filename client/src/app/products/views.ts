import {Component, HostBinding, input, viewChild} from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { Product } from "src/app/_models/product";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ProductFormComponent } from "src/app/products/components/product-form.component";
import { ProductHeaderComponent } from "src/app/products/components/product-header.component";

@Component({
  selector: 'div[productNewView]',
  template: `
  <div productForm [use]="use()" [id]="null" [view]="view()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ ProductFormComponent, ModalWrapperModule, ProductHeaderComponent, ],
})
export class ProductNewComponent {
  use = input.required<FormUse>();
  view = input.required<View>();

  formComponent = viewChild.required(ProductFormComponent);

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }

  onFillForm = () => this.formComponent().fillForm();
}

@Component({
  selector: 'div[productDetailView]',
  template: `
  `,
  standalone: true,
  imports: [ProductFormComponent, ProductHeaderComponent],
})
export class ProductDetailComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Product>();
  key = input.required<string | undefined>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }
}

@Component({
  selector: 'div[productEditView]',
  template: `
  <div productForm [use]="use()" [id]="id()" [view]="view()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ ProductFormComponent, ModalWrapperModule, ProductHeaderComponent, ],
})
export class ProductEditComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Product>();
  key = input.required<string | undefined>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }
}
