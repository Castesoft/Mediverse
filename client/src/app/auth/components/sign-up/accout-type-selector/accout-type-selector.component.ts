import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-accout-type-selector',
  standalone: true,
  imports: [],
  templateUrl: './accout-type-selector.component.html',
  styleUrl: './accout-type-selector.component.scss'
})
export class AccoutTypeSelectorComponent {
  selectedAccountType = input.required<'patient' | 'doctor'>();
  onSelectAccountType = output<string>();

  selectAccountType(type: string) {
    this.onSelectAccountType.emit(type);
  }
}
