import { Component, DestroyRef, effect, inject } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Product } from 'src/app/_models/products/product';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation, ParamMap } from "@angular/router";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[adminProductEditRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div productForm
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminProductEditRouteComponent extends BaseRouteDetail<Product> {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly SiteSection: typeof SiteSection = SiteSection;

  constructor() {
    super('products', FormUse.EDIT);
    this.key.set(`${this.router.url}#product-edit`);

    effect(() => {
      this.subscribeToParamMap();
      this.subscribeToRouteData();
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
