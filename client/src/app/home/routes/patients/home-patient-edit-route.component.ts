import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Patient from 'src/app/_models/patients/patient';

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homePatientEditRoute]',
  template: `
    <div patientDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-patient-edit-route.component.html',
  standalone: false,
})
export class HomePatientEditRouteComponent
  extends BaseRouteDetail<Patient>

{
  constructor() {
    super('patients', 'edit');

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
