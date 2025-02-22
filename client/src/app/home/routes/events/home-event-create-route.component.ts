import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Event from 'src/app/_models/events/event';
import { FormUse } from 'src/app/_models/forms/formTypes';

@Component({
  selector: 'div[homeEventCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div
        eventDetail
        [(use)]="use"
        [(view)]="view"
        [(item)]="item"
        [(key)]="key"
        [(title)]="title"></div>
    </div>
  `,
  standalone: false,
})
export class HomeEventCreateRouteComponent extends BaseRouteDetail<Event> {
  constructor() {
    super('events', FormUse.CREATE);

    this.key.set(`${this.router.url}#event-create`);

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

