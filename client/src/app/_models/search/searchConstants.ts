import { doctorResultInfo } from "../doctors/doctorResults/doctorResultConstants";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Search } from "src/app/_models/search/search";


export const searchInfo: FormInfo<Search> = {
  specialty: { type: 'select', label: 'Especialidad', showLabel: false, showCodeSpan: false, },
  location: { type: 'select', label: 'Ubicación', showLabel: false, showCodeSpan: false, },
  pageNumber: { type: 'number', label: 'Página', showLabel: false, },
  pageSize: { type: 'number', label: 'Resultados por página', showLabel: false, },
  result: doctorResultInfo,
} as FormInfo<Search>;
