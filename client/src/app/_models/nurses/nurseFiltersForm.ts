import { createId } from '@paralleldrive/cuid2';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { nurseFiltersFormInfo } from 'src/app/_models/nurses/nurseConstants';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';

export class NurseFiltersForm extends FormGroup2<NurseParams> {
  constructor() {
    super(NurseParams as any, new NurseParams(createId()), nurseFiltersFormInfo);
  }
}
