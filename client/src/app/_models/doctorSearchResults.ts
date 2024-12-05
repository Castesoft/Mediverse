import { FormInfo } from "src/app/_forms/form2";
import { doctorResultInfo } from "./doctorResults/doctorResultConstants";
import { DoctorResult } from "./doctorResults/doctorResult";

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
