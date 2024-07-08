import { Component } from '@angular/core';
import { MedicineFormComponent } from './medicine-form.component';

@Component({
  selector: '[medicineDetailView]',
  template: `
  <!-- <div medicineForm [use]="'detail'"></div> -->

  `,
  standalone: true,
  imports: [ 
    // MedicineFormComponent,
   ],
})
export class MedicineDetailComponent {}
