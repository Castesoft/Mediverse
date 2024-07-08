import { Component } from '@angular/core';
import { PrescriptionFormComponent } from './prescription-form.component';

@Component({
  selector: '[prescriptionDetailView]',
  template: `
  <!-- <div prescriptionForm [use]="'detail'"></div> -->

  `,
  standalone: true,
  imports: [ 
    // PrescriptionFormComponent,
   ],
})
export class PrescriptionDetailComponent {}
