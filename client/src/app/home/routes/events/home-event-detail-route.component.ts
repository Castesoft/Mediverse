import { Component, effect } from "@angular/core";
import BaseRouteDetail from "src/app/_models/base/components/extensions/routes/baseRouteDetail";
import Event from 'src/app/_models/events/event';
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeEventDetailRoute]',
  template: `
    <div eventDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-event-detail-route.component.html',
  standalone: false,
})
export class HomeEventDetailRouteComponent
  extends BaseRouteDetail<Event>

{
  constructor() {
    super('events', FormUse.DETAIL);

    this.key.set(`${this.router.url}#event-detail`);

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
          console.log('HomeEventDetailRouteComponent', this.item());

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
