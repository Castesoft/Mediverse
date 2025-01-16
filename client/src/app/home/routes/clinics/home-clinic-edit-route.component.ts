import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Clinic from 'src/app/_models/clinics/clinic';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeClinicEditRoute]',
  template: `
    <div clinicDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-clinic-edit-route.component.html',
  standalone: false,
})
export class HomeClinicEditRouteComponent
  extends BaseRouteDetail<Clinic>

{
  constructor() {
    super('clinics', FormUse.EDIT);

    this.key.set(`${this.router.url}#clinic-edit`);

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
