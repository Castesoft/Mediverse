import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Patient } from 'src/app/_models/patients/patient';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: 'div[homePatientEditRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div patientForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"></div>
    </div>
  `,
  standalone: false,
})
export class HomePatientEditRouteComponent
  extends BaseRouteDetail<Patient>

{
  constructor() {
    super('patients', FormUse.EDIT);

    this.key.set(`${this.router.url}#patient-edit`);

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
