import { CommonModule } from '@angular/common';
import { Component, effect, input, model, ModelSignal, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Doctor } from 'src/app/_models/doctors/doctor';
import { doctorCells } from 'src/app/_models/doctors/doctorConstants';
import { DoctorFiltersForm } from 'src/app/_models/doctors/doctorFiltersForm';
import { DoctorParams } from 'src/app/_models/doctors/doctorParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { DoctorsService } from 'src/app/doctors/doctors.config';
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { UserTableCellComponent } from "../users/components/user-table-cell.component";
import { Column } from "src/app/_models/base/column";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { DoctorsDeliveryStatusBadgeComponent } from "src/app/doctors/components/doctors-delivery-status-badge.component";
import { DoctorsStatusBadgeComponent } from "src/app/doctors/components/doctors-status-badge.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[doctorsTable]',
  templateUrl: './doctors-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    TableMenuComponent,
    UserTableCellComponent,
    DoctorsDeliveryStatusBadgeComponent,
    DoctorsStatusBadgeComponent,
  ],
})
export class DoctorsTableComponent extends BaseTable<Doctor, DoctorParams, DoctorFiltersForm, DoctorsService> implements OnDestroy, TableInputSignals<Doctor, DoctorParams> {
  item: ModelSignal<Doctor | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<DoctorParams> = model.required();
  data: ModelSignal<Doctor[]> = model.required();

  columns: Column[] = [];
  showDoctorColumn = input<boolean>(false);

  constructor() {
    super(DoctorsService, Doctor, { tableCells: doctorCells, });

    effect((): void => {
      if (this.columns.length === 0) {
        this.columns = this.service.columns;
      }

      if (this.showDoctorColumn() || this.params().fromSection && this.params().fromSection === SiteSection.ADMIN) {
        this.service.columns = this.columns;
      } else {
        this.service.columns = this.columns.filter(column => column.name !== 'doctor');
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected readonly SiteSection = SiteSection;
}
