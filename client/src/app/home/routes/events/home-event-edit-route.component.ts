import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Event from 'src/app/_models/events/event';

@Component({
  // host: { class: 'card card-flush' },
  selector: 'div[homeEventEditRoute]',
  template: `
    <div eventDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
  `,
  // templateUrl: './home-event-edit-route.component.html',
  standalone: false,
})
export class HomeEventEditRouteComponent extends BaseRouteDetail<Event> {
  constructor() {
    super('events', 'edit');

    this.key.set(`${this.router.url}#event-edit`);

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
