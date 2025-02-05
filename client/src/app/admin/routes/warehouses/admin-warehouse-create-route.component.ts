import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Warehouse } from 'src/app/_models/warehouses/warehouse';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[adminWarehouseCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div warehouseForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminWarehouseCreateRouteComponent extends BaseRouteDetail<Warehouse> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;

  constructor() {
    super('warehouses', FormUse.CREATE);

    this.key.set(`${this.router.url}#warehouse-create`);

    effect(() => {
      const navigation: Navigation | null = this.router.getCurrentNavigation();
      if (navigation !== null) {
        this.key.set(navigation?.extras?.state?.['key'] || null);
      }
    });
  }
}
