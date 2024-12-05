import { Injectable } from "@angular/core";
import { Clinic } from "src/app/_models/clinics/clinic";
import { clinicColumns, clinicDictionary } from "src/app/_models/clinics/clinicConstants";
import { ClinicFiltersForm } from "src/app/_models/clinics/clinicFiltersForm";
import { ClinicParams } from "src/app/_models/clinics/clinicParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root'
})
export class ClinicsService extends ServiceHelper<Clinic, ClinicParams, ClinicFiltersForm> {
  constructor() {
    super(ClinicParams, 'clinics',  clinicDictionary, clinicColumns);
  }
}
