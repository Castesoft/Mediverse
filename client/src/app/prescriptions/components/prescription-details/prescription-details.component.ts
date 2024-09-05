import { Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prescription } from 'src/app/_models/prescription';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';
import { FormUse, View } from 'src/app/_models/types';

@Component({
  selector: 'app-prescription-details',
  standalone: true,
  imports: [PrescriptionFormComponent],
  templateUrl: './prescription-details.component.html',
  styleUrl: './prescription-details.component.scss'
})
export class PrescriptionDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // @HostBinding('class') get hostClass() {
  //   if (this.view === 'page') {
  //     return 'card';
  //   }
  //   else return '';
  // }

  // View Configuration
  use: FormUse = 'detail';
  view: View = 'page';

  item?: Prescription;
  id?: number;
  key?: string;
  label?: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.id.toString();
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }

}
