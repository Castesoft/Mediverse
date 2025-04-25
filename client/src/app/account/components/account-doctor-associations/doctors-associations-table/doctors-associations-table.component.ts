import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal, signal, WritableSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import {
  DoctorAssociationsService
} from "src/app/account/components/account-doctor-associations/doctor-associations.config";
import { DoctorAssociationParams } from "src/app/_models/doctorAssociations/doctorAssociationParams";
import { CatalogMode, View } from "src/app/_models/base/types";
import {
  doctorAssociationCells,
  doctorAssociationColumnsDoctorView,
  doctorAssociationColumnsNurseView
} from "src/app/_models/doctorAssociations/doctorAssociationConstants";
import { AccountService } from "src/app/_services/account.service";
import { User } from "src/app/_models/users/user";
import { DoctorAssociationFiltersForm } from "src/app/_models/doctorAssociations/doctorAssociationFiltersForm";
import { UserTableCellComponent } from "src/app/users/components/user-table-cell.component";
import {
  DoctorsAssociationsTableMenuComponent
} from "src/app/account/components/account-doctor-associations/doctors-associations-table-menu/doctors-associations-table-menu.component";
import { Column } from "src/app/_models/base/column";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[doctorsAssociationsTable]',
  templateUrl: './doctors-associations-table.component.html',
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    UserTableCellComponent,
    DoctorsAssociationsTableMenuComponent,
  ],
})
export class DoctorsAssociationsTableComponent extends BaseTable<DoctorAssociation, DoctorAssociationParams, DoctorAssociationFiltersForm, DoctorAssociationsService> implements TableInputSignals<DoctorAssociation, DoctorAssociationParams> {
  item: ModelSignal<DoctorAssociation | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<DoctorAssociationParams> = model.required();
  data: ModelSignal<DoctorAssociation[]> = model.required();

  readonly accountService: AccountService = inject(AccountService);
  viewingRole: 'doctor' | 'nurse' = 'doctor';

  displayColumns: WritableSignal<Column[]> = signal([]);

  constructor() {
    super(DoctorAssociationsService, DoctorAssociation, { tableCells: doctorAssociationCells });

    effect(() => {
      const currentParams = this.params();
      let columnsToSet: Column[];

      if (currentParams.doctorId !== null && currentParams.doctorId !== undefined) {
        this.viewingRole = 'doctor';
        columnsToSet = doctorAssociationColumnsDoctorView;
      } else if (currentParams.nurseId !== null && currentParams.nurseId !== undefined) {
        this.viewingRole = 'nurse';
        columnsToSet = doctorAssociationColumnsNurseView;
      } else {
        console.warn("DoctorNurseTable: Could not determine viewing role from params. Defaulting to Doctor view.");
        this.viewingRole = 'doctor';
        columnsToSet = doctorAssociationColumnsDoctorView;
      }

      this.displayColumns.set(columnsToSet);
    });
  }

  getUserForCell(item: DoctorAssociation): User {
    if (this.viewingRole === 'doctor') {
      return new User({
        id: item.nurseId,
        fullName: item.nurseName,
        email: item.nurseEmail,
        photoUrl: item.nursePhotoUrl,
      });
    } else {
      return new User({
        id: item.doctorId,
        fullName: item.doctorName,
        email: item.doctorEmail,
        photoUrl: item.doctorPhotoUrl,
      });
    }
  }


  getRoleForCell(): string {
    return this.viewingRole === 'doctor' ? 'Nurse' : 'Doctor';
  }
}

