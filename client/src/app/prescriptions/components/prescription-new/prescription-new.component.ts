import { Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prescription } from 'src/app/_models/prescription';
import { FormUse, View } from 'src/app/_models/types';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';

@Component({
  selector: 'app-prescription-new',
  standalone: true,
  imports: [PrescriptionFormComponent],
  templateUrl: './prescription-new.component.html',
  styleUrl: './prescription-new.component.scss'
})
export class PrescriptionNewComponent {
  private router = inject(Router);

  @HostBinding('class') get hostClass() {
    if (this.view === 'page') {
      return 'card';
    }
    else return '';
  }

  // View Configuration
  use: FormUse = 'create';
  view: View = 'page';

  item?: Prescription;
  id?: number;
  key?: string;
  label?: string;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
