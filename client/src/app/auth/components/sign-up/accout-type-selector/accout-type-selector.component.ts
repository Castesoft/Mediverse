import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-accout-type-selector',
  templateUrl: './accout-type-selector.component.html',
})
export class AccoutTypeSelectorComponent {
  accountType: ModelSignal<'patient' | 'doctor'> = model.required();

  selectAccountType(type: string) {
    this.accountType.update(_ => type as 'patient' | 'doctor');
  }
}
