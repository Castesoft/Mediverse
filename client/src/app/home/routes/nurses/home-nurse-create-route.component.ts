import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Nurse from 'src/app/_models/nurses/nurse';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";

@Component({
  selector: 'div[homeNurseCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div nurseAssociateForm></div>
    </div>
  `,
  standalone: false,
})
export class HomeNurseCreateRouteComponent
  extends BaseRouteDetail<Nurse> {
  constructor() {
    super('nurses', FormUse.CREATE);

    this.key.set(`${this.router.url}#nurse-create`);

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
