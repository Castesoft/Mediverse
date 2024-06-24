import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PatientDetailComponent } from './components/patient-detail.component';
import { Patient } from '../_models/patient';
import { PatientsService } from '../_services/data/patients.service';

@Component({
  selector: 'patient-detail-route',
  template: `
    @if (patient !== undefined && id !== null) {
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="../../">Admin</a></li>
          <li class="breadcrumb-item"><a routerLink="../">Prescripcións</a></li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ patient.name }}
          </li>
        </ol>
      </nav>

      <div patientDetail [id]="id"></div>
    }
  `,
  standalone: true,
  imports: [PatientDetailComponent, RouterModule],
})
export class DetailComponent implements OnInit {
  patient?: Patient;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: PatientsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
        this.service.getById(this.id).subscribe({
          next: (patient) => {
            this.patient = patient;
          },
        });
      },
    });
  }
}
