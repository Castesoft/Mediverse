import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MedicineEditComponent } from './components/medicine-edit.component';
import { Medicine } from '../_models/medicine';
import { MedicinesService } from '../_services/data/medicines.service';

@Component({
  selector: 'medicine-edit-route',
  template: `
    @if (medicine) {
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="/dashboards">Admin</a></li>
          <li class="breadcrumb-item">
            <a routerLink="/dashboards/medicines">Medicamentos</a>
          </li>
          <!-- <li class="breadcrumb-item">
            <a routerLink="/admin/mantenimiento/medicines/{{ medicine.id }}"
              >{{ medicine.consecutive.code }} {{ medicine.number }}
              {{ medicine.year }}</a
            >
          </li> -->
          <li class="breadcrumb-item active">Cambios</li>
        </ol>
      </nav>
      <div medicineEditView [medicine]="medicine" [id]="id"></div>
    }
  `,
  standalone: true,
  imports: [MedicineEditComponent, RouterModule],
})
export class EditComponent implements OnInit {
  medicine?: Medicine;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private service: MedicinesService,
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin([this.service.getById(this.id)]).subscribe(([medicine]) => {
      this.medicine = medicine;
    });
  }
}
