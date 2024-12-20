import Evolution from 'src/app/_models/events/detail/evolution';
import { FormInfo } from 'src/app/_models/forms/formTypes';

export const evolutionFormInfo: FormInfo<Evolution> = {
  content: { label: 'Contenido', type: 'textarea', },
} as FormInfo<Evolution>;
