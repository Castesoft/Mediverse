import NextStep from 'src/app/_models/events/detail/nextStep';
import { nextStepFormInfo } from 'src/app/_models/events/detail/nextStepConstants';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

export default class NextStepForm extends FormGroup2<NextStep> {

  constructor() {
    super(NextStep, new NextStep(), nextStepFormInfo);
  }

}
