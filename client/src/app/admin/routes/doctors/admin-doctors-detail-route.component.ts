import { Component, DestroyRef, effect, inject, OnDestroy } from "@angular/core";
import BaseRouteDetail from "src/app/_models/base/components/extensions/routes/baseRouteDetail";
import { Doctor } from "src/app/_models/doctors/doctor.model";
import { FormUse } from "src/app/_models/forms/formTypes";
import { takeUntil } from "rxjs/operators";
import { Navigation, ParamMap } from "@angular/router";
import { Subject } from "rxjs";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[adminDoctorDetailRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div doctorForm
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false
})
export class AdminDoctorDetailRouteComponent extends BaseRouteDetail<Doctor> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    super('doctors', FormUse.DETAIL);
    this.key.set(`${this.router.url}#doctor-detail`);

    effect(() => {
      this.subscribeToParamMap();
      this.subscribeToRouteData();
      this.setKey();
    })
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
