import { Injectable } from "@angular/core";
import { RelativeType } from "src/app/_models/relativeTypes/relativeType";
import { relativeTypeDictionary, relativeTypeColumns } from "src/app/_models/relativeTypes/relativeTypeConstants";
import { RelativeTypeFiltersForm } from "src/app/_models/relativeTypes/relativeTypeFiltersForm";
import { RelativeTypeParams } from "src/app/_models/relativeTypes/relativeTypeParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class RelativeTypesService extends ServiceHelper<RelativeType, RelativeTypeParams, RelativeTypeFiltersForm> {
  constructor() {
    super(RelativeTypeParams, 'relativeTypes', relativeTypeDictionary, relativeTypeColumns);
  }
}
