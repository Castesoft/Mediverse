import NextStep from 'src/app/_models/events/detail/nextStep';
import { FormInfo } from 'src/app/_models/forms/formTypes';

export const nextStepFormInfo: FormInfo<NextStep> = {
  content: { label: 'Contenido', type: 'textarea', },
} as FormInfo<NextStep>;
