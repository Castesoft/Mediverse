import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Service } from 'src/app/_models/services/service';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeServiceCreateRoute]',
  template: `
    <div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-service-detail-route.component.html',
  standalone: false,
})
export class HomeServiceCreateRouteComponent
  extends BaseRouteDetail<Service>

{
  constructor() {
    super('services', FormUse.CREATE);

    this.key.set(`${this.router.url}#service-create`);

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
