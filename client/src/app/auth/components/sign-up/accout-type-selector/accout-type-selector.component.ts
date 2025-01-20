import { Component, model } from '@angular/core';

@Component({
  selector: 'app-accout-type-selector',
  standalone: true,
  imports: [],
  templateUrl: './accout-type-selector.component.html',
})
export class AccoutTypeSelectorComponent {
  accountType = model.required<'patient' | 'doctor'>();

  selectAccountType(type: string) {
    this.accountType.update(oldValue => type as 'patient' | 'doctor');
  }
}
