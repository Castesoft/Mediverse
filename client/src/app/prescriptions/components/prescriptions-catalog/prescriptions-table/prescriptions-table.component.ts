import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  ModelSignal,
  model,
  input,
  output,
  signal,
  InputSignal,
  OutputEmitterRef,
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
import { View, CatalogMode } from 'src/app/_models/base/types';
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
import { PrescriptionsService } from 'src/app/prescriptions/prescriptions.config';
import { UserTableCellComponent } from 'src/app/users/components/user-table-cell.component';
import { Column } from "src/app/_models/base/column";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: {
    class: 'table table-hover align-middle table-row-dashed fs-6 gy-5 dataTable',
    id: 'kt_table_prescriptions',
  },
  selector: 'table[prescriptionsTable]',
  standalone: true,
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
export class PrescriptionsTableComponent
  extends BaseTable<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService>
  implements OnDestroy, TableInputSignals<Prescription, PrescriptionParams>
{
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

    await new Promise((resolve) => setTimeout(resolve, 400));

    const prescriptionElement = document.getElementById(`prescription-form-${item.id}`);

    if (prescriptionElement) {
      const options = {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: true,
        letterRendering: true,
        windowWidth: 1024,
      };

      const canvas = await html2canvas(prescriptionElement, options);

      const pdfWidth = 297;
      const pdfHeight = 210;
      const pdf = new jsPDF('l', 'mm', [ pdfWidth, pdfHeight ]);

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

      pdf.save(`${item.patient!.name!} - ${item.createdAt}.pdf`);
    } else {
      console.error('Prescription form element not found');
    }
  }

  async printPrescription(item: Prescription) {
    item.isCollapsed = true;

    await new Promise((resolve) => setTimeout(resolve, 400));

    const prescriptionElement = document.getElementById(
      `prescription-form-${item.id}`
    );

    if (prescriptionElement) {
      const options = {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: true,
        letterRendering: true,
        windowWidth: 1024,
      };

      const canvas = await html2canvas(prescriptionElement, options);
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Receta</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { max-width: 100%; max-height: 100%; }
              </style>
            </head>
            <body>
              <img src="${imgData}" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();

        printWindow.onload = () => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        };
      } else {
        console.error('Unable to open print window');
      }
    } else {
      console.error('Prescription form element not found');
    }
  }

  protected readonly FormUse = FormUse;
}
