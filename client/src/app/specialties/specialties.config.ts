import { Injectable } from "@angular/core";
import { Specialty } from "src/app/_models/specialties/specialty";
import { specialtyColumns, specialtyDictionary } from "src/app/_models/specialties/specialtyConstants";
import { SpecialtyFiltersForm } from "src/app/_models/specialties/specialtyFiltersForm";
import { SpecialtyParams } from "src/app/_models/specialties/specialtyParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class SpecialtiesService extends ServiceHelper<Specialty, SpecialtyParams, SpecialtyFiltersForm> {
  constructor() {
    super(SpecialtyParams, 'specialties', specialtyDictionary, specialtyColumns);
  }
}
