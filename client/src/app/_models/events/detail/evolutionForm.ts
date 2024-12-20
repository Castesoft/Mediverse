import Evolution from 'src/app/_models/events/detail/evolution';
import { evolutionFormInfo } from 'src/app/_models/events/detail/evolutionConstants';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

export default class EvolutionForm extends FormGroup2<Evolution> {

  constructor() {
    super(Evolution, new Evolution(), evolutionFormInfo);
  }

}
