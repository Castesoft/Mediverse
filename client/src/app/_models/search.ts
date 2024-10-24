import { HttpParams } from "@angular/common/http";
import { ParamMap, Params } from "@angular/router";
import { SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2 } from "src/app/_forms/form2";
import { Doctor, doctorInfo } from "src/app/_models/doctor";

export class Search {
  specialty: SelectOption | null = null;
  location: SelectOption | null = null;
  doctor: Doctor = new Doctor();
  pageNumber: number | null = 1;
  pageSize: number | null = 5;
  tab: string | null = 'general';

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
      this.doctor = new Doctor({ id: +params.get('doctorId')! });
      if (params.has('doctorFullName')) {
        this.doctor.fullName = params.get('doctorFullName')!;
      }
    }

    console.log(this);


    return this;
  }

  get params(): Params {
    const params: Params = {};

    if (this.specialty?.id) params['specialtyId'] = this.specialty.id.toString();
    if (this.specialty?.name) params['specialty'] = this.specialty.name;
    if (this.location?.code) params['location'] = this.location.code;
    if (this.location?.name) params['locationName'] = this.location.name;
    if (this.doctor.id) params['doctorId'] = this.doctor.id.toString();
    if (this.doctor.fullName) params['doctorFullName'] = this.doctor.fullName;
    if (this.pageNumber) params['pageNumber'] = this.pageNumber.toString();
    if (this.pageSize) params['pageSize'] = this.pageSize.toString();

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
  doctor: doctorInfo,
} as FormInfo<Search>;

export class SearchForm extends FormGroup2<Search> {
  constructor() {
    super(Search, new Search(), searchInfo, { orientation: 'inline', });
  }

  get params(): Params {
    return new Search({ ...this.value, doctor: new Doctor({...this.controls.doctor.value}) }).params;
  }
}
