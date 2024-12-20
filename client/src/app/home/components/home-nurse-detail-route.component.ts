import { Component, effect } from "@angular/core";
import BaseRouteDetail from "src/app/_models/base/components/extensions/routes/baseRouteDetail";
import Nurse from "src/app/_models/nurses/nurse";

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeNurseDetailRoute]',
  template: `
    <div nurseDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-nurse-detail-route.component.html',
  standalone: false,
})
export class HomeNurseDetailRouteComponent
  extends BaseRouteDetail<Nurse>

{
  constructor() {
    super('nurses', 'detail');

    this.key.set(`${this.router.url}#nurse-detail`);

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
