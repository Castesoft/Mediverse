import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Warehouse } from "src/app/_models/warehouses/warehouse";
import { WarehouseFiltersForm } from "src/app/_models/warehouses/warehouseFiltersForm";
import { WarehouseParams } from "src/app/_models/warehouses/warehouseParams";
import { WarehousesService } from "src/app/warehouses/warehouses.config";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[adminWarehousesCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div warehousesCatalog [(item)]="item" [(isCompact)]="compact.isCompact" [(key)]="key" [(mode)]="mode"
           [(params)]="params" [(view)]="view"></div>
    </div>
  `,
  standalone: false,
})
export class AdminWarehousesCatalogRouteComponent extends BaseRouteCatalog<Warehouse, WarehouseParams, WarehouseFiltersForm, WarehousesService> {
  constructor() {
    super(WarehousesService, 'warehouses');
    this.params().fromSection = SiteSection.ADMIN
  }
}
