import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Prescription } from 'src/app/_models/prescriptions/prescription';

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homePrescriptionDetailRoute]',
  template: `
    <div prescriptionDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-prescription-detail-route.component.html',
  standalone: false,
})
export class HomePrescriptionDetailRouteComponent
  extends BaseRouteDetail<Prescription>

{
  constructor() {
    super('prescriptions', 'detail');

    this.key.set(`${this.router.url}#prescription-detail`);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
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
