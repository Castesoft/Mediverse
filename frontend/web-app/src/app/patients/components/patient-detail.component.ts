import { Component } from '@angular/core';
import { PatientFormComponent } from './patient-form.component';

@Component({
  selector: '[patientDetailView]',
  template: `
  <!-- <div patientForm [use]="'detail'"></div> -->

  `,
  standalone: true,
  imports: [ 
    // PatientFormComponent,
   ],
})
export class PatientDetailComponent {}
