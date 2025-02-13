import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Clinic from 'src/app/_models/clinics/clinic';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: '' },
  selector: 'div[homeClinicCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div clinicForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
    </div>
  `,
  // templateUrl: './home-clinic-detail-route.component.html',
  standalone: false,
})
export class HomeClinicCreateRouteComponent
  extends BaseRouteDetail<Clinic>

{
  constructor() {
    super('clinics', FormUse.CREATE);

    this.key.set(`${this.router.url}#clinic-create`);

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
