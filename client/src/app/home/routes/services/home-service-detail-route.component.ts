import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Service } from 'src/app/_models/services/service';

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeServiceDetailRoute]',
  template: `
    <div serviceDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-service-detail-route.component.html',
  standalone: false,
})
export class HomeServiceDetailRouteComponent
  extends BaseRouteDetail<Service>

{
  constructor() {
    super('services', 'detail');

    this.key.set(`${this.router.url}#service-detail`);

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
