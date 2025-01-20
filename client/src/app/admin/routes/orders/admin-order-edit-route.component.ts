import { Component, effect, OnDestroy } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Order } from 'src/app/_models/orders/order';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation, ParamMap } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  selector: 'div[adminOrderEditRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div orderForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminOrderEditRouteComponent extends BaseRouteDetail<Order> implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  protected readonly SiteSection: typeof SiteSection = SiteSection;

  constructor() {
    super('orders', FormUse.EDIT);
    this.key.set(`${this.router.url}#order-edit`);

    effect(() => {
      this.subscribeToParamMap();
      this.subcribeToRouteData();
      this.setKey();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToParamMap() {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params: ParamMap) => {
        if (params.has('id')) this.id.set(+params.get('id')!);
      },
    });
  }

  private subcribeToRouteData() {
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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
