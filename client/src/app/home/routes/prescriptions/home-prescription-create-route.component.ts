import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homePrescriptionCreateRoute]',
  template: `
    <div prescriptionDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-prescription-detail-route.component.html',
  standalone: false,
})
export class HomePrescriptionCreateRouteComponent
  extends BaseRouteDetail<Prescription>

{
  constructor() {
    super('prescriptions', FormUse.CREATE);

    this.key.set(`${this.router.url}#prescription-create`);

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}
