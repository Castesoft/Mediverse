import { Injectable } from "@angular/core";
import { Patient } from "src/app/_models/patients/patient";
import { patientColumns, patientDictionary } from "src/app/_models/patients/patientConstants";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root'
})
export class PatientsService extends ServiceHelper<Patient, PatientParams, PatientFiltersForm> {
  constructor() {
    super(PatientParams, 'patients', patientDictionary, patientColumns);
  }
}
