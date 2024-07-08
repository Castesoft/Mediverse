import { Component, Input } from '@angular/core';
import { PatientFormComponent } from './patient-form.component';
import { Patient } from '../../_models/patient';

@Component({
  selector: '[patientEditView]',
  template: `<div patientForm [use]="'edit'"></div>`,
  standalone: true,
  imports: [ PatientFormComponent, ],
})
export class PatientEditComponent {
  @Input({ required: true }) patient!: Patient;
}
