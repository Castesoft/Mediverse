import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Product } from 'src/app/_models/products/product';

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeProductEditRoute]',
  template: `
    <div productDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-product-edit-route.component.html',
  standalone: false,
})
export class HomeProductEditRouteComponent
  extends BaseRouteDetail<Product>

{
  constructor() {
    super('products', 'edit');

    this.key.set(`${this.router.url}#product-edit`);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
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
