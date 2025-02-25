import { Component, effect } from '@angular/core';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import { Patient } from 'src/app/_models/patients/patient';
import { FormUse } from "src/app/_models/forms/formTypes";
import { Navigation } from "@angular/router";

@Component({
  selector: 'div[homePatientCreateRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div patientDetail
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"
           [(title)]="title"></div>
    </div>
  `,
  standalone: false,
})
export class HomePatientCreateRouteComponent
  extends BaseRouteDetail<Patient> {
  constructor() {
    super('patients', FormUse.CREATE);

    this.key.set(`${this.router.url}#patient-create`);

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
