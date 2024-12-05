import { Injectable } from "@angular/core";
import { Occupation } from "src/app/_models/occupations/occupation";
import { occupationColumns, occupationDictionary } from "src/app/_models/occupations/occupationConstants";
import { OccupationFiltersForm } from "src/app/_models/occupations/occupationFiltersForm";
import { OccupationParams } from "src/app/_models/occupations/occupationParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class OccupationsService extends ServiceHelper<Occupation, OccupationParams, OccupationFiltersForm> {
  constructor() {
    super(OccupationParams, 'occupations', occupationDictionary, occupationColumns);
  }
}
