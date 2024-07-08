import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Prescription, PrescriptionParams } from '../../_models/prescription';
import { CatalogMode, SortOptions } from '../../_models/types';
import { ConfirmService } from '../../_services/confirm/confirm.service';
import { PrescriptionsService } from '../../_services/data/prescriptions.service';
import { EnvService } from '../../_services/env.service';
import { TableHeaderComponent } from '../../_utils/table/table-header.component';
import { RouterModule } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from '../../_services/icons.service';

@Component({
  host: { class: 'table fs--1 mb-0 leads-table', },
  selector: 'table[prescriptionsTable]',
  templateUrl: './prescriptions-table.component.html',
  standalone: true,
  imports: [ TableHeaderComponent, RouterModule, NgClass, FormsModule, NgStyle, FontAwesomeModule,  ],
})
export class PrescriptionsTableComponent implements OnInit, OnDestroy {
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();
  @Input() data: Prescription[] = [];

  sortAscending = false;
  devMode = false;
  params!: PrescriptionParams;
  columns = Prescription.columns;

  subscriptions: Subscription[] = [];

  constructor(
    public service: PrescriptionsService,
    public dev: EnvService,
    private confirm: ConfirmService,
    private toastr: ToastrService,
    public icons: IconsService,
  ) {}

  ngOnInit(): void {

    const devSubscription = this.dev.mode$.subscribe({
      next: (devMode) => {
        this.devMode = devMode;
      },
    });

    const paramsSubscription = this.service.params$.subscribe({
      next: (params: PrescriptionParams) => {
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

  deleteById = (item: Prescription) =>
    Prescription.deleteItems([item], this.service, this.confirm, this.toastr);
}
