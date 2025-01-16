import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Nurse from 'src/app/_models/nurses/nurse';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeNurseCreateRoute]',
  template: `
    <div nurseDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-nurse-detail-route.component.html',
  standalone: false,
})
export class HomeNurseCreateRouteComponent
  extends BaseRouteDetail<Nurse>

{
  constructor() {
    super('nurses', FormUse.CREATE);

    this.key.set(`${this.router.url}#nurse-create`);

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
