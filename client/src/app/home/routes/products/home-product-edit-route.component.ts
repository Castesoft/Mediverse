import { Component, DestroyRef, effect, inject } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Product } from 'src/app/_models/products/product';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation, ParamMap } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeProductEditRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div productForm
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"></div>
    </div>
  `,
  standalone: false,
})
export class HomeProductEditRouteComponent extends BaseRouteDetail<Product> {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    super('products', FormUse.EDIT);

    this.key.set(`${this.router.url}#product-edit`);

    effect(() => {
      this.subscribeToRouteData()
      this.subscribeToParamMap();
      this.setKey();
    });
  }

  private subscribeToParamMap() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params: ParamMap) => {
        if (params.has('id')) this.id.set(+params.get('id')!);
      },
    });
  }

  private subscribeToRouteData() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
  }

  private setKey() {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation !== null) {
      this.key.set(navigation?.extras?.state?.['key'] || null);
    }
  }
}
