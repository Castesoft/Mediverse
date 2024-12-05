import { Injectable } from "@angular/core";
import { ColorBlindness } from "src/app/_models/colorBlindnesses/colorBlindness";
import { colorBlindnessDictionary, colorBlindnessColumns } from "src/app/_models/colorBlindnesses/colorBlindnessConstants";
import { ColorBlindnessFiltersForm } from "src/app/_models/colorBlindnesses/colorBlindnessFiltersForm";
import { ColorBlindnessParams } from "src/app/_models/colorBlindnesses/colorBlindnessParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class ColorBlindnessesService extends ServiceHelper<ColorBlindness, ColorBlindnessParams, ColorBlindnessFiltersForm> {
  constructor() {
    super(ColorBlindnessParams, 'colorBlindnesses', colorBlindnessDictionary, colorBlindnessColumns);
  }
}
