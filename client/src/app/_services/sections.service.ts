import { Injectable } from "@angular/core";
import { sectionDictionary, SectionDictionary, Sections } from "src/app/_models/types";

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  sections: SectionDictionary = sectionDictionary;

  get = (key: Sections) => this.sections[key];

}
