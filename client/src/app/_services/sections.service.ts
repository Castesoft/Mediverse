import { Injectable } from "@angular/core";
import { sectionDictionary } from "src/app/_models/sections/sectionConstants";
import { SectionDictionary, Sections } from "src/app/_models/sections/sectionTypes";

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  sections: SectionDictionary = sectionDictionary;

  get = (key: Sections) => this.sections[key];

}
