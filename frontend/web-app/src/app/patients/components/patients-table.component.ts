import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CatalogMode, SortOptions } from '../../_models/types';
import { ConfirmService } from '../../_services/confirm/confirm.service';
import { EnvService } from '../../_services/env.service';
import { TableHeaderComponent } from '../../_utils/table/table-header.component';
import { RouterModule } from '@angular/router';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from '../../_services/icons.service';
import { Patient, PatientParams } from '../../_models/patient';
import { PatientsService } from '../../_services/data/patients.service';
import { GuidService } from '../../_services/guid.service';

@Component({
  host: { class: 'table fs--1 mb-0 leads-table' },
  selector: 'table[patientsTable]',
  templateUrl: './patients-table.component.html',
  standalone: true,
  imports: [
    DatePipe,
    TableHeaderComponent,
    RouterModule,
    NgClass,
    FormsModule,
    NgStyle,
    FontAwesomeModule,
  ],
})
export class PatientsTableComponent implements OnInit, OnDestroy {
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();
  @Input() data: Patient[] = [];

  sortAscending = false;
  devMode = false;
  params!: PatientParams;
  columns = Patient.columns;

  selectedPatientId: number | null = null;

  subscriptions: Subscription[] = [];

  cuid: string;

  constructor(
    public service: PatientsService,
    public dev: EnvService,
    private confirm: ConfirmService,
    private toastr: ToastrService,
    public icons: IconsService,
    guid: GuidService,
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
      next: (params: PatientParams) => {
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
      this.selectedPatientId = patient.id;
      this.service.setSelected(patient);
    }
  }

  deleteById = (item: Patient) =>
    Patient.deleteItems([item], this.service, this.confirm, this.toastr);
}
