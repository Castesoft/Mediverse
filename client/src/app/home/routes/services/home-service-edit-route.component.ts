import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Service } from 'src/app/_models/services/service';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeServiceEditRoute]',
  template: `
    <div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-service-edit-route.component.html',
  standalone: false,
})
export class HomeServiceEditRouteComponent
  extends BaseRouteDetail<Service>

{
  constructor() {
    super('services', FormUse.EDIT);

    this.key.set(`${this.router.url}#service-edit`);

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
