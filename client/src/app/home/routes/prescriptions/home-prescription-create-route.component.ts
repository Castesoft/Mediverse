import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";

@Component({
  selector: 'div[homePrescriptionCreateRoute]',
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
export class HomePrescriptionCreateRouteComponent extends BaseRouteDetail<Prescription> {
  constructor() {
    super('prescriptions', FormUse.CREATE);

    this.key.set(`${this.router.url}#prescription-create`);

    effect(() => {
      const navigation: Navigation | null = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key: any = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}
