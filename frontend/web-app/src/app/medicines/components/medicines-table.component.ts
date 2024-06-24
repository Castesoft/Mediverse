import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatalogMode, SortOptions } from '../../_models/types';
import { ConfirmService } from '../../_services/confirm/confirm.service';
import { EnvService } from '../../_services/env.service';
import { TableHeaderComponent } from '../../_utils/table/table-header.component';
import { RouterModule } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from '../../_services/icons.service';
import { MedicinesService } from '../../_services/data/medicines.service';
import { Medicine, MedicineParams } from '../../_models/medicine';
import { GuidService } from '../../_services/guid.service';

@Component({
  host: { class: 'table fs--1 mb-0 leads-table' },
  selector: 'table[medicinesTable]',
  templateUrl: './medicines-table.component.html',
  standalone: true,
  imports: [
    TableHeaderComponent,
    RouterModule,
    NgClass,
    FormsModule,
    NgStyle,
    FontAwesomeModule,
  ],
})
export class MedicinesTableComponent implements OnInit, OnDestroy {
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();
  @Input() data: Medicine[] = [];

  sortAscending = false;
  devMode = false;
  params!: MedicineParams;
  columns = Medicine.columns;

  selectedMedicineId: number | null = null;

  subscriptions: Subscription[] = [];

  cuid: string;

  constructor(
    public service: MedicinesService,
    public dev: EnvService,
    private confirm: ConfirmService,
    private toastr: ToastrService,
    public icons: IconsService,
    guid: GuidService
  ) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    const devSubscription = this.dev.mode$.subscribe({
      next: (devMode) => {
        this.devMode = devMode;
      },
    });

    const paramsSubscription = this.service.params$.subscribe({
      next: (params: MedicineParams) => {
        this.params = params;
      },
    });

    this.subscriptions.push(devSubscription);
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onSortOptionsChange(sortOptions: SortOptions) {
    this.params.sort = sortOptions.sort;
    this.params.isSortAscending = sortOptions.isSortAscending;
    this.service.setParams(this.params);
  }

  selectAll(isSelected: boolean) {
    if (this.data) {
      this.data.forEach((item) => {
        item.isSelected = isSelected;
      });
    }
  }

  selectItem(patientId: number) {
    const patient = this.data?.find((c) => c.id === patientId);
    if (patient) {
      this.selectedMedicineId = patient.id;
      this.service.setSelected(patient);
    }
  }

  selectMultiple(medicineId: number) {
    console.log(medicineId);

    this.data?.forEach((item) => {
      if (item.id === medicineId) {
        item.isSelected = !item.isSelected;
      }
    });

    const medicines = this.data?.filter((x) => x.isSelected);

    if (medicines) {
      this.service.setMultipleSelected(medicines);
    }
  }

  deleteById = (item: Medicine) =>
    Medicine.deleteItems([item], this.service, this.confirm, this.toastr);
}
