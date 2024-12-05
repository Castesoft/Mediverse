import { Injectable } from "@angular/core";
import { Disease } from "src/app/_models/diseases/disease";
import { diseaseColumns, diseaseDictionary } from "src/app/_models/diseases/diseaseConstants";
import { DiseaseFiltersForm } from "src/app/_models/diseases/diseaseFiltersForm";
import { DiseaseParams } from "src/app/_models/diseases/diseaseParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class DiseasesService extends ServiceHelper<Disease, DiseaseParams, DiseaseFiltersForm> {
  constructor() {
    super(DiseaseParams, 'diseases', diseaseDictionary, diseaseColumns);
  }
}
