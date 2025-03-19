import { Component, DestroyRef, effect, inject, OnDestroy } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Warehouse } from 'src/app/_models/warehouses/warehouse';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation, ParamMap } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[adminWarehouseEditRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div warehouseForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminWarehouseEditRouteComponent extends BaseRouteDetail<Warehouse> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    super('warehouses', FormUse.EDIT);
    this.key.set(`${this.router.url}#warehouse-edit`);

    effect(() => {
      this.subscribeToParamMap();
      this.subcribeToRouteData();
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

  private subcribeToRouteData() {
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
