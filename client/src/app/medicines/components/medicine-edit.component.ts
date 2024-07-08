import { Component, Input } from '@angular/core';
import { MedicineFormComponent } from './medicine-form.component';
import { Medicine } from '../../_models/medicine';

@Component({
  selector: '[medicineEditView]',
  template: `<div medicineForm [use]="'edit'"></div>`,
  standalone: true,
  imports: [ MedicineFormComponent, ],
})
export class MedicineEditComponent {
  @Input({ required: true }) medicine!: Medicine;
}
