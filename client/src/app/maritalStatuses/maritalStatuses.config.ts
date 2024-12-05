import { Injectable } from "@angular/core";
import { MaritalStatus } from "src/app/_models/maritalStatuses/maritalStatus";
import { maritalStatusDictionary, maritalStatusColumns } from "src/app/_models/maritalStatuses/maritalStatusConstants";
import { MaritalStatusFiltersForm } from "src/app/_models/maritalStatuses/maritalStatusFiltersForm";
import { MaritalStatusParams } from "src/app/_models/maritalStatuses/maritalStatusParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class MaritalStatusesService extends ServiceHelper<MaritalStatus, MaritalStatusParams, MaritalStatusFiltersForm> {
  constructor() {
    super(MaritalStatusParams, 'maritalStatuses', maritalStatusDictionary, maritalStatusColumns);
  }
}
