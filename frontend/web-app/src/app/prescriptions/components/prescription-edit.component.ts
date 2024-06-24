import { Component, Input } from '@angular/core';
import { PrescriptionFormComponent } from './prescription-form.component';
import { Prescription } from '../../_models/prescription';

@Component({
  selector: '[prescriptionEditView]',
  template: `<div prescriptionForm [use]="'edit'"></div>`,
  standalone: true,
  imports: [ PrescriptionFormComponent, ],
})
export class PrescriptionEditComponent {
  @Input({ required: true }) prescription!: Prescription;
}
