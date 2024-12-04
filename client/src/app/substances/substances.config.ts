import { Injectable } from "@angular/core";
import { Substance } from "src/app/_models/substances/substance";
import { substanceColumns, substanceDictionary } from "src/app/_models/substances/substanceConstants";
import { SubstanceFiltersForm } from "src/app/_models/substances/substanceFiltersForm";
import { SubstanceParams } from "src/app/_models/substances/substanceParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class SubstancesService extends ServiceHelper<Substance, SubstanceParams, SubstanceFiltersForm> {
  constructor() {
    super(SubstanceParams, 'substances', substanceDictionary, substanceColumns);
  }
}
