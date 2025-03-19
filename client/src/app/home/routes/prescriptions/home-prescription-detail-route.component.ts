import { Component, DestroyRef, effect, inject } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation, ParamMap } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[homePrescriptionDetailRoute]',
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
export class HomePrescriptionDetailRouteComponent extends BaseRouteDetail<Prescription> {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    super('prescriptions', FormUse.DETAIL);

    this.key.set(`${this.router.url}#prescription-detail`);

    effect(() => {
      this.subscribeToParamMap();
      this.subscribeToRouteData();
      this.setKey();
    });
  }

  private subscribeToParamMap() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params: ParamMap) => {
        if (params.has('id')) {
          this.id.set(+params.get('id')!);
        }
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
