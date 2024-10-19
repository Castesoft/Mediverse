import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { AccountService } from 'src/app/_services/account.service';
import { ClinicalHistoryFormComponent, MedicalRecord } from './clinical-history-form/clinical-history-form.component';

@Component({
  selector: 'app-account-clinical-history',
  standalone: true,
  imports: [CommonModule, BootstrapModule, ClinicalHistoryFormComponent],
  templateUrl: './account-clinical-history.component.html',
  styles: [
    `
      .btn-outline-danger:hover .ki-trash {
        color: white !important;
      }
    `
  ]
})
export class AccountClinicalHistoryComponent {
  accountService = inject(AccountService);

  medicalRecord = signal<MedicalRecord>(new MedicalRecord());

  constructor() {
    this.accountService.getMedicalRecord().subscribe({
      next: response => {
        this.medicalRecord.set(response);
      }
    });
  }
}
