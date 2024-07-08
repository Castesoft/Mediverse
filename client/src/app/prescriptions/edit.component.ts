import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Prescription } from '../_models/prescription';
import { PrescriptionEditComponent } from './components/prescription-edit.component';
import { PrescriptionsService } from '../_services/data/prescriptions.service';

@Component({
  selector: 'prescription-edit-route',
  template: `
    @if (prescription) {
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="/admin">Admin</a></li>
          <li class="breadcrumb-item">
            <a routerLink="/admin/mantenimiento/prescripcions">Prescripcións</a>
          </li>
          <!-- <li class="breadcrumb-item">
            <a routerLink="/admin/mantenimiento/prescripcions/{{ prescription.id }}"
              >{{ prescription.consecutive.code }} {{ prescription.number }}
              {{ prescription.year }}</a
            >
          </li> -->
          <li class="breadcrumb-item active">Cambios</li>
        </ol>
      </nav>
      <div prescriptionEditView [prescription]="prescription" [id]="id"></div>
    }
  `,
  standalone: true,
  imports: [PrescriptionEditComponent, RouterModule],
})
export class EditComponent implements OnInit {
  prescription?: Prescription;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private service: PrescriptionsService,
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin([this.service.getById(this.id)]).subscribe(([prescription]) => {
      this.prescription = prescription;
    });
  }
}
