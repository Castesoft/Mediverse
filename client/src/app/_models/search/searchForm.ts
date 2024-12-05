import { Params } from "@angular/router";
import { DoctorResult } from "../doctorResults/doctorResult";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Search } from "src/app/_models/search/search";
import { searchInfo } from "src/app/_models/search/searchConstants";


export class SearchForm extends FormGroup2<Search> {
  constructor() {
    super(Search, new Search(), searchInfo, { orientation: 'inline', });
  }

  getParams(): Params {
    return new Search({ ...this.value, result: new DoctorResult({ ...this.controls.result.value, } as any) }).params;
  }
}
