import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Product } from 'src/app/_models/products/product';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";

@Component({
  selector: 'div[homeProductCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div productForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
    </div>
  `,
  standalone: false,
})
export class HomeProductCreateRouteComponent extends BaseRouteDetail<Product> {
  constructor() {
    super('products', FormUse.CREATE);

    this.key.set(`${this.router.url}#product-create`);

    effect(() => {
      this.setKey();
    });
  }

  private setKey(): void {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation !== null) {
      this.key.set(navigation?.extras?.state?.['key'] || null);
    }
  }
}
