import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import Clinic from "src/app/_models/clinics/clinic";
import ClinicFiltersForm from "src/app/_models/clinics/clinicFiltersForm";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { ClinicsService } from "src/app/clinics/clinics.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeClinicsCatalogRoute]',
  templateUrl: './home-clinics-catalog-route.component.html',
  standalone: false,
})
export class HomeClinicsCatalogRouteComponent
  extends BaseRouteCatalog<Clinic, ClinicParams, ClinicFiltersForm, ClinicsService>
{

  constructor() {
    super(ClinicsService, 'clinics');
  }

}
