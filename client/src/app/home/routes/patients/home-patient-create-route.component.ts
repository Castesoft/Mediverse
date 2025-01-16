import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Patient } from 'src/app/_models/patients/patient';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homePatientCreateRoute]',
  template: `
    <div patientDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-patient-detail-route.component.html',
  standalone: false,
})
export class HomePatientCreateRouteComponent
  extends BaseRouteDetail<Patient>

{
  constructor() {
    super('patients', FormUse.CREATE);

    this.key.set(`${this.router.url}#patient-create`);

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
