import { Injectable } from "@angular/core";
import { ConsumptionLevel } from "src/app/_models/consumptionLevels/consumptionLevel";
import { consumptionLevelDictionary, consumptionLevelColumns } from "src/app/_models/consumptionLevels/consumptionLevelConstants";
import { ConsumptionLevelFiltersForm } from "src/app/_models/consumptionLevels/consumptionLevelFiltersForm";
import { ConsumptionLevelParams } from "src/app/_models/consumptionLevels/consumptionLevelParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class ConsumptionLevelsService extends ServiceHelper<ConsumptionLevel, ConsumptionLevelParams, ConsumptionLevelFiltersForm> {
  constructor() {
    super(ConsumptionLevelParams, 'consumptionLevels', consumptionLevelDictionary, consumptionLevelColumns);
  }
}
