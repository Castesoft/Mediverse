import { Params } from "@angular/router";
import { DoctorResult } from "../doctors/doctorResults/doctorResult";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Search } from "src/app/_models/search/search";
import { searchFormInfo } from "src/app/_models/search/searchConstants";
import { createId } from '@paralleldrive/cuid2';
import { getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';


export class SearchForm extends FormGroup2<Search> {
  constructor() {
    super(Search as any, new Search(createId()), searchFormInfo, { orientation: 'inline', });
  }

  getParams(): Params {
    return getSearchRouteQueryParams(new Search(this.controls.key.value, { ...this.value, result: new DoctorResult({ ...this.controls.result.value, } as any) }));
  }
}
