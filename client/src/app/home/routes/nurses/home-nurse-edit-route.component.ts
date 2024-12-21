import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Nurse from 'src/app/_models/nurses/nurse';

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeNurseEditRoute]',
  template: `
    <div nurseDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-nurse-edit-route.component.html',
  standalone: false,
})
export class HomeNurseEditRouteComponent
  extends BaseRouteDetail<Nurse>

{
  constructor() {
    super('nurses', 'edit');

    this.key.set(`${this.router.url}#nurse-edit`);

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
