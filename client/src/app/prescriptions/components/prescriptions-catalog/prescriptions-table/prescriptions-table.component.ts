import { Component, OnInit, Input, inject, input, OnDestroy, output } from "@angular/core";
import { CatalogMode, Role } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {CdkModule} from "src/app/_shared/cdk.module";
import {MaterialModule} from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Prescription, PrescriptionParams } from "src/app/_models/prescription";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { PrescriptionsService } from "src/app/_services/prescriptions.service";
import {PrescriptionTableCellComponent, PrescriptionTableHasAccountCellComponent, PrescriptionTableSexCellComponent} from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescription-table-cell.component";
import { UserTableCellComponent } from 'src/app/users/components/user-table-cell.component';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { PrescriptionFormComponent } from '../../prescription-form/prescription-form.component';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_prescriptions', },
  selector: 'table[prescriptionsTable]',
  standalone: true,
  templateUrl: './prescriptions-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, PrescriptionTableCellComponent, DatePipe,
    PrescriptionTableSexCellComponent, PrescriptionTableHasAccountCellComponent, MaterialModule, CdkModule, CurrencyPipe, UserTableCellComponent, BootstrapModule, PrescriptionFormComponent,
    UserProfilePictureComponent
  ],
})
export class PrescriptionsTableComponent implements OnInit, OnDestroy {
  service = inject(PrescriptionsService);
  icons = inject(IconsService);

  @Input() data: Prescription[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);
  onReloadData = output();

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: PrescriptionParams;

  subscriptions: Subscription[] = [];

  cuid: string;
  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  deleteItem(item: Prescription) {
    const deleteSubscription = this.service.delete$(item).subscribe(() => {
      this.onReloadData.emit();
    });
    this.subscriptions.push(deleteSubscription);
  }

  toggleCollapsed(item: Prescription) {
    const initalItemState = item.isCollapsed;
    this.data.map(item => item.isCollapsed = false);
    item.isCollapsed = !initalItemState;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  async downloadPrescription(item: Prescription) {
    // Wait for Angular to update the view
    await new Promise(resolve => setTimeout(resolve, 100));

    const prescriptionElement = document.getElementById(`prescription-form-${item.id}`);
    
    if (prescriptionElement) {
      const canvas = await html2canvas(prescriptionElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`prescription-${item.id}.pdf`);
    } else {
      console.error('Prescription form element not found');
    }
  }
}
