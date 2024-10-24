import { HttpParams } from "@angular/common/http";
import { ParamMap, Params } from "@angular/router";
import { SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2 } from "src/app/_forms/form2";
import { Doctor, doctorInfo } from "src/app/_models/doctor";
import { DoctorResult, doctorResultInfo } from "src/app/_models/doctorResult";
import { searchResultsInfo } from "src/app/_models/doctorSearchResults";

export class Search {
  specialty: SelectOption | null = null;
  location: SelectOption | null = null;
  result: DoctorResult = new DoctorResult();
  pageNumber: number | null = 1;
  pageSize: number | null = 5;
  tab: string | null = 'general';
  dayNumber: number | null = null;
  scheduleOption: number | null = null;

  constructor(init?: Partial<Omit<Search, 'setFromQueryParamMap' | 'params' | 'httpParams'>>) {
    Object.assign(this, init);
  }

  setFromQueryParamMap(params: ParamMap): this {
    if (params.has('specialty') && params.has('specialtyId')) {
      this.specialty = new SelectOption({ id: +params.get('specialtyId')!, name: params.get('specialty')!, code: params.get('specialty')! });
    }
    if (params.has('location') && params.has('locationName')) {
      this.location = new SelectOption({ code: params.get('location')!, name: params.get('locationName')! });
    }
    if (params.has('pageNumber')) {
      this.pageNumber = +params.get('pageNumber')!;
    }
    if (params.has('pageSize')) {
      this.pageSize = +params.get('pageSize')!;
    }
    if (params.has('doctorId')) {
      this.result = new DoctorResult({ id: +params.get('doctorId')! });
      if (params.has('doctorName')) {
        this.result.fullName = params.get('doctorName')!;
      }
    }
    if (params.has('tab')) {
      this.tab = params.get('tab')!;
    }
    if (params.has('dayNumber')) {
      this.dayNumber = +params.get('dayNumber')!;
    }
    if (params.has('scheduleOption')) {
      this.scheduleOption = +params.get('scheduleOption')!;
    }

    return this;
  }

  get params(): Params {
    const params: Params = {};

    if (this.specialty?.id) params['specialtyId'] = this.specialty.id.toString();
    else params['specialtyId'] = null;

    if (this.specialty?.name) params['specialty'] = this.specialty.name;
    else params['specialty'] = null;

    if (this.location?.code) params['location'] = this.location.code;
    else params['location'] = null;

    if (this.location?.name) params['locationName'] = this.location.name;
    else params['locationName'] = null;

    if (this.result.id) params['doctorId'] = this.result.id.toString();
    else params['doctorId'] = null;

    if (this.result.fullName) params['doctorName'] = this.result.fullName;
    else params['doctorName'] = null;

    if (this.pageNumber) params['pageNumber'] = this.pageNumber.toString();
    else params['pageNumber'] = null;

    if (this.pageSize) params['pageSize'] = this.pageSize.toString();
    else params['pageSize'] = null;

    if (this.tab) params['tab'] = this.tab;
    else params['tab'] = null;

    if (this.dayNumber !== null) params['dayNumber'] = this.dayNumber;
    else params['dayNumber'] = null;

    if (this.scheduleOption !== null) params['scheduleOption'] = this.scheduleOption;
    else params['scheduleOption'] = null;

    return params;
  }

  get httpParams(): HttpParams {
    let params = new HttpParams();

    if (this.specialty?.id) params = params.append('specialtyId', this.specialty.id.toString());
    if (this.specialty?.name) params = params.append('specialty', this.specialty.name);
    if (this.location?.code) params = params.append('location', this.location.code);
    if (this.location?.name) params = params.append('locationName', this.location.name);
    if (this.pageNumber) params = params.append('pageNumber', this.pageNumber.toString());
    if (this.pageSize) params = params.append('pageSize', this.pageSize.toString());

    return params;
  }
}

export const searchInfo: FormInfo<Search> = {
  specialty: { type: 'select', label: 'Especialidad', showLabel: false, showCodeSpan: false, },
  location: { type: 'select', label: 'Ubicación', showLabel: false, showCodeSpan: false, },
  pageNumber: { type: 'number', label: 'Página', showLabel: false, },
  pageSize: { type: 'number', label: 'Resultados por página', showLabel: false, },
  result: doctorResultInfo,
} as FormInfo<Search>;

export class SearchForm extends FormGroup2<Search> {
  constructor() {
    super(Search, new Search(), searchInfo, { orientation: 'inline', });
  }

  get params(): Params {
    return new Search({ ...this.value, result: new DoctorResult({...this.controls.result.value, } as any) }).params;
  }
}
