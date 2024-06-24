import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Prescription } from '../_models/prescription';
import { PrescriptionDetailComponent } from './components/prescription-detail.component';
import { PrescriptionsService } from '../_services/data/prescriptions.service';

@Component({
  selector: 'prescription-detail-route',
  template: `
    @if (prescription !== undefined && id !== null) {
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="../../">Admin</a></li>
          <li class="breadcrumb-item"><a routerLink="../">Prescripcións</a></li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ prescription.patient.firstName }} {{ prescription.patient.lastName }}
          </li>
        </ol>
      </nav>

      <div prescriptionDetail [id]="id"></div>
    }
  `,
  standalone: true,
  imports: [PrescriptionDetailComponent, RouterModule],
})
export class DetailComponent implements OnInit {
  prescription?: Prescription;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: PrescriptionsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
        this.service.getById(this.id).subscribe({
          next: (prescription) => {
            this.prescription = prescription;
          },
        });
      },
    });
  }
}
