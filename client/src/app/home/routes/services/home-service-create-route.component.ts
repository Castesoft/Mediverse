import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Service } from 'src/app/_models/services/service';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";

@Component({
  selector: 'div[homeServiceCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div serviceDetail
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"
           [(title)]="title"></div>
    </div>
  `,
  standalone: false,
})
export class HomeServiceCreateRouteComponent extends BaseRouteDetail<Service> {
  constructor() {
    super('services', FormUse.CREATE);

    this.key.set(`${this.router.url}#service-create`);

    effect(() => {
      this.setKey();
    });
  }

  private setKey(): void {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation !== null) {
      this.key.set(navigation?.extras?.state?.['key'] || null);
    }
  }
}
