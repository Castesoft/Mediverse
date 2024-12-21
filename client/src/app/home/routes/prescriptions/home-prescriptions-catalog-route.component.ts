import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homePrescriptionsCatalogRoute]',
  // selector: 'home-prescriptions-catalog-route',
  // template: ``,
  templateUrl: './home-prescriptions-catalog-route.component.html',
  standalone: false,
})
export class HomePrescriptionsCatalogRouteComponent
  extends BaseRouteCatalog<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService>
{

  constructor() {
    super(PrescriptionsService, 'prescriptions');
  }

}
