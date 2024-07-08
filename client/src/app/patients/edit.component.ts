import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PatientEditComponent } from './components/patient-edit.component';
import { Patient } from '../_models/patient';
import { PatientsService } from '../_services/data/patients.service';

@Component({
  selector: 'patient-edit-route',
  template: `
    @if (patient) {
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="/dashboards">Admin</a></li>
          <li class="breadcrumb-item">
            <a routerLink="/dashboards/patients">Medicamentos</a>
          </li>
          <!-- <li class="breadcrumb-item">
            <a routerLink="/admin/mantenimiento/patients/{{ patient.id }}"
              >{{ patient.consecutive.code }} {{ patient.number }}
              {{ patient.year }}</a
            >
          </li> -->
          <li class="breadcrumb-item active">Cambios</li>
        </ol>
      </nav>
      <div patientEditView [patient]="patient" [id]="id"></div>
    }
  `,
  standalone: true,
  imports: [PatientEditComponent, RouterModule],
})
export class EditComponent implements OnInit {
  patient?: Patient;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private service: PatientsService,
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin([this.service.getById(this.id)]).subscribe(([patient]) => {
      this.patient = patient;
    });
  }
}
