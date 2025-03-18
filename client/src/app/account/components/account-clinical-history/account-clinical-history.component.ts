import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { AccountService } from 'src/app/_services/account.service';
import { ClinicalHistoryFormComponent } from './clinical-history-form/clinical-history-form.component';
import { MedicalRecord } from "src/app/_models/medicalRecords/medicalRecord";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'app-account-clinical-history',
  templateUrl: './account-clinical-history.component.html',
  styles: [
    `
      .btn-outline-danger:hover .ki-trash {
        color: white !important;
      }
    `
  ],
  imports: [
    CommonModule,
    BootstrapModule,
    ClinicalHistoryFormComponent,
    AccountChildWrapperComponent
  ],
})
export class AccountClinicalHistoryComponent {
  accountService: AccountService = inject(AccountService);

  medicalRecord: WritableSignal<MedicalRecord> = signal(new MedicalRecord());

  constructor() {
    this.accountService.getMedicalRecord().subscribe({
      next: (response: MedicalRecord) => {
        this.medicalRecord.set(response);
      }
    });
  }
}
