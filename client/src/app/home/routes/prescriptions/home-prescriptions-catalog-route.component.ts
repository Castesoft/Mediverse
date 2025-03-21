import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.service";

@Component({
  selector: 'div[homePrescriptionsCatalogRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div prescriptionsCatalog
           [(item)]="item"
           [(isCompact)]="compact.isCompact"
           [(key)]="key"
           [(mode)]="mode"
           [(params)]="params"
           [(view)]="view"
      ></div>
    </div>
  `,
  standalone: false,
})
export class HomePrescriptionsCatalogRouteComponent extends BaseRouteCatalog<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService> {
  constructor() {
    super(PrescriptionsService, 'prescriptions');
  }
}
