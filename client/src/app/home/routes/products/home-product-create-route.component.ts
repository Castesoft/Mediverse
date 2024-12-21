import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Product } from 'src/app/_models/products/product';

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeProductCreateRoute]',
  template: `
    <div productDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-product-detail-route.component.html',
  standalone: false,
})
export class HomeProductCreateRouteComponent
  extends BaseRouteDetail<Product>

{
  constructor() {
    super('products', 'create');

    this.key.set(`${this.router.url}#product-create`);

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}
