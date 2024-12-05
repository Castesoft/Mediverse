import { Injectable } from "@angular/core";
import { EducationLevel } from "src/app/_models/educationLevels/educationLevel";
import { educationLevelDictionary, educationLevelColumns } from "src/app/_models/educationLevels/educationLevelConstants";
import { EducationLevelFiltersForm } from "src/app/_models/educationLevels/educationLevelFiltersForm";
import { EducationLevelParams } from "src/app/_models/educationLevels/educationLevelParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class EducationLevelsService extends ServiceHelper<EducationLevel, EducationLevelParams, EducationLevelFiltersForm> {
  constructor() {
    super(EducationLevelParams, 'educationLevels', educationLevelDictionary, educationLevelColumns);
  }
}
