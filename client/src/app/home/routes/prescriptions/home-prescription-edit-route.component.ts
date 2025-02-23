import { Component, effect, OnDestroy } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { FormUse } from "src/app/_models/forms/formTypes";
import { takeUntil } from "rxjs/operators";
import { Navigation, ParamMap } from "@angular/router";
import { Subject } from "rxjs";

@Component({
  selector: 'div[homePrescriptionEditRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div prescriptionDetail
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"
           [(title)]="title"
      ></div>
    </div>
  `,
  standalone: false,
})
export class HomePrescriptionEditRouteComponent extends BaseRouteDetail<Prescription> implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
    super('prescriptions', FormUse.EDIT);

    this.key.set(`${this.router.url}#prescription-edit`);

    effect(() => {
      this.subscribeToRouteData()
      this.subscribeToParamMap();
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

  private subscribeToRouteData() {
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
