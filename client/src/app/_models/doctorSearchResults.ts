import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { doctorResultInfo } from "src/app/_models/doctors/doctorResults/doctorResultConstants";
import { FormInfo } from "src/app/_models/forms/formTypes";

export class SearchResults {
  doctors: DoctorResult[] = [];
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(init?: Partial<SearchResults>) {
    Object.assign(this, init);
  }
}

export const searchResultsInfo: FormInfo<SearchResults> = {
  doctors: doctorResultInfo,
  latitude: { label: 'Latitud', type: 'number' },
  longitude: { label: 'Longitud', type: 'number' },
} as FormInfo<SearchResults>;
