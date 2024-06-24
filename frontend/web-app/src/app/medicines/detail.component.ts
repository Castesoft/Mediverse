import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MedicineDetailComponent } from './components/medicine-detail.component';
import { Medicine } from '../_models/medicine';
import { MedicinesService } from '../_services/data/medicines.service';

@Component({
  selector: 'medicine-detail-route',
  template: `
    @if (medicine !== undefined && id !== null) {
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="../../">Admin</a></li>
          <li class="breadcrumb-item"><a routerLink="../">Prescripcións</a></li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ medicine.name }}
          </li>
        </ol>
      </nav>

      <div medicineDetail [id]="id"></div>
    }
  `,
  standalone: true,
  imports: [MedicineDetailComponent, RouterModule],
})
export class DetailComponent implements OnInit {
  medicine?: Medicine;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: MedicinesService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
        this.service.getById(this.id).subscribe({
          next: (medicine) => {
            this.medicine = medicine;
          },
        });
      },
    });
  }
}
