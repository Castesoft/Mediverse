import { doctorResultInfo } from 'src/app/_models/doctors/doctorResults/doctorResultConstants';
import { FormInfo } from 'src/app/_models/forms/formTypes';
import { Search } from 'src/app/_models/search/search';

export const searchFormInfo: FormInfo<Search> = {
  specialty: {
    type: 'select',
    label: 'Especialidad',
    showLabel: false,
    showCodeSpan: false,
    placeholder: 'Especialidad, procedimiento, doctor...'
  },
  location: {
    type: 'select',
    label: 'Ubicación',
    showLabel: false,
    showCodeSpan: false,
    placeholder: 'Ciudad, estado, código postal...'
  },
  pageNumber: { type: 'number', label: 'Página', showLabel: false, },
  pageSize: { type: 'number', label: 'Resultados por página', showLabel: false, },
  result: doctorResultInfo,
} as FormInfo<Search>;
