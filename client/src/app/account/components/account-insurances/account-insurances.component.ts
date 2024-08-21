import { Component, inject, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/_services/account.service';
import { InsuranceModalComponent } from './insurance-modal/insurance-modal.component';

@Component({
  selector: 'app-account-insurances',
  standalone: true,
  imports: [],
  templateUrl: './account-insurances.component.html',
  styleUrl: './account-insurances.component.scss'
})
export class AccountInsurancesComponent implements OnInit {
  private bsModalService = inject(BsModalService);
  accountService = inject(AccountService);

  ngOnInit(): void {
    this.accountService.getUserMedicalInsuranceCompanies();
  }

  openAddInsuranceModal() {
    this.bsModalService.show(InsuranceModalComponent, {
      initialState: {
        title: 'Añadir póliza de seguro',
      },
    });
  }

  openEditInsuranceModal(insurance: any) {
    this.bsModalService.show(InsuranceModalComponent, {
      initialState: {
        title: 'Editar póliza de seguro',
        type: 'edit',
        insurance,
      },
    });
  }

  deleteInsurance(insuranceId: number) {
    this.accountService.deleteMedicalInsurance(insuranceId).subscribe();
  }
}
