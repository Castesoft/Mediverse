import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  Input,
  model,
  input,
  output,
  signal,
  ModelSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/_models/account/account';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';
import { IconsService } from 'src/app/_services/icons.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TableHeaderComponent } from 'src/app/_shared/template/components/tables/table-header.component';
import { PrescriptionFormComponent } from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import {
  PrescriptionTableCellComponent,
  PrescriptionTableSexCellComponent,
  PrescriptionTableHasAccountCellComponent,
} from 'src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescription-table-cell.component';
import { PrescriptionsService } from 'src/app/prescriptions/prescriptions.config';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { UserTableCellComponent } from 'src/app/users/components/user-table-cell.component';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import { PrescriptionFiltersForm } from 'src/app/_models/prescriptions/prescriptionFiltersForm';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { prescriptionCells } from 'src/app/_models/prescriptions/prescriptionConstants';

@Component({
  host: {
    class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable',
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
    ProfilePictureComponent,
    PrescriptionTableCellComponent,
    PrescriptionTableSexCellComponent,
    PrescriptionTableHasAccountCellComponent,
    UserTableCellComponent,
    PrescriptionFormComponent,
  ],
})
export class PrescriptionsTableComponent
  extends BaseTable<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionsService>
  implements OnInit, OnDestroy, TableInputSignals<Prescription, PrescriptionParams>
{
  item: ModelSignal<Prescription | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PrescriptionParams> = model.required();
  data: ModelSignal<Prescription[]> = model.required();

  constructor() {
    super(PrescriptionsService, Prescription, { tableCells: prescriptionCells, });
  }

  showHeaders = input<boolean>(true);
  onReloadData = output();

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;

  account = signal<Account | null>(null);

  subscriptions: Subscription[] = [];

  cuid: string = createId();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  deleteItem(item: Prescription) {
    // const deleteSubscription = this.service.delete$(item).subscribe(() => {
    //   this.onReloadData.emit();
    // });
    // this.subscriptions.push(deleteSubscription);
  }

  toggleCollapsed(item: Prescription) {
    const initalItemState = item.isCollapsed;
    // this.data.map((item) => (item.isCollapsed = false));
    item.isCollapsed = !initalItemState;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  async downloadPrescription(item: Prescription) {
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

      const pdfWidth = 297;
      const pdfHeight = 210;
      const pdf = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);

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
}
