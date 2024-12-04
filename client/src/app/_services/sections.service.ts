import { Injectable } from "@angular/core";
import { SectionDictionary, Sections } from "src/app/_models/types";
import { sectionDictionary } from "../_models/sections/sectionConstants";

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  sections: SectionDictionary = sectionDictionary;

  get = (key: Sections) => this.sections[key];

}
