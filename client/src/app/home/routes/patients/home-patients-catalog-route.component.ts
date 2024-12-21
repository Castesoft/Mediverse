import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import Patient from "src/app/_models/patients/patient";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { PatientsService } from "src/app/patients/patients.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homePatientsCatalogRoute]',
  // selector: 'home-patients-catalog-route',
  // template: ``,
  templateUrl: './home-patients-catalog-route.component.html',
  standalone: false,
})
export class HomePatientsCatalogRouteComponent
  extends BaseRouteCatalog<Patient, PatientParams, PatientFiltersForm, PatientsService>
{

  constructor() {
    super(PatientsService, 'patients');
  }

}
