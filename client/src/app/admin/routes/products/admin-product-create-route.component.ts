import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Product } from 'src/app/_models/products/product';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[adminProductCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div productForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminProductCreateRouteComponent extends BaseRouteDetail<Product> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;

  constructor() {
    super('products', FormUse.CREATE);

    this.key.set(`${this.router.url}#product-create`);

    effect(() => {
      const navigation: Navigation | null = this.router.getCurrentNavigation();
      if (navigation !== null) {
        this.key.set(navigation?.extras?.state?.['key'] || null);
      }
    });
  }
}
