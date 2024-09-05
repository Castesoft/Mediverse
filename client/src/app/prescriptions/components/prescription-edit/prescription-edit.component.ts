import { Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prescription } from 'src/app/_models/prescription';
import { FormUse, View } from 'src/app/_models/types';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';

@Component({
  selector: 'app-prescription-edit',
  standalone: true,
  imports: [PrescriptionFormComponent],
  templateUrl: './prescription-edit.component.html',
  styleUrl: './prescription-edit.component.scss'
})
export class PrescriptionEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // @HostBinding('class') get hostClass() {
  //   if (this.view === 'page') {
  //     return 'card';
  //   }
  //   else return '';
  // }

  // View Configuration
  use: FormUse = 'edit';
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
