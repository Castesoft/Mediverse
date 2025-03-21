import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnDestroy,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/_models/account/account';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { prescriptionCells } from 'src/app/_models/prescriptions/prescriptionConstants';
import { PrescriptionFiltersForm } from 'src/app/_models/prescriptions/prescriptionFiltersForm';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TableHeaderComponent } from 'src/app/_shared/template/components/tables/table-header.component';
import {
  PrescriptionFormComponent
} from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import { UserTableCellComponent } from 'src/app/users/components/user-table-cell.component';
import { Column } from "src/app/_models/base/column";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { FormUse } from "src/app/_models/forms/formTypes";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.service";

@Component({
  host: {
    class: 'table table-hover align-middle table-row-dashed fs-6 gy-5 dataTable',
    id: 'kt_table_prescriptions',
  },
  selector: 'table[prescriptionsTable]',
  templateUrl: './prescriptions-table.component.html',
  imports: [
    FontAwesomeModule,
    TableHeaderComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    BsDropdownModule,
    MaterialModule,
    CdkModule,
    BootstrapModule,
    PrescriptionFormComponent,
    UserTableCellComponent,
    TableMenuComponent,
  ],
})
export class PrescriptionsTableComponent extends BaseTable<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService> implements OnDestroy, TableInputSignals<Prescription, PrescriptionParams> {
  protected readonly FormUse: typeof FormUse = FormUse;

  item: ModelSignal<Prescription | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PrescriptionParams> = model.required();
  data: ModelSignal<Prescription[]> = model.required();

  constructor() {
    super(PrescriptionsService, Prescription, { tableCells: prescriptionCells });
  }

  showHeaders: InputSignal<boolean> = input<boolean>(true);
  onReloadData: OutputEmitterRef<void> = output();

  columns: WritableSignal<Column[]> = signal<Column[]>(this.service.columns);
  account: WritableSignal<Account | null> = signal<Account | null>(null);

  subscriptions: Subscription[] = [];

  cuid: string = createId();

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  toggleCollapsed(item: Prescription) {
    if (!item.id) {
      console.error('Cannot collapse prescription without ID');
      return;
    }

    this.service.toggleCollapsedInService(item.id);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  async downloadPrescription(item: Prescription) {
    item.isCollapsed = true;
    await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 100));

    const element: HTMLElement | null = document.getElementById(`prescription-form-${item.id}`);
    if (!element) return;

    await this.service.export(item, element, 'download');
  }

  async printPrescription(item: Prescription) {
    item.isCollapsed = true;
    await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 100));

    const element: HTMLElement | null = document.getElementById(`prescription-form-${item.id}`);
    if (!element) return;

    await this.service.export(item, element, 'print');
  }
}
