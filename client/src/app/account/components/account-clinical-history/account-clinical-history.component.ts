import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { AccountService } from 'src/app/_services/account.service';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  accessGranted: Date;
}

@Component({
  selector: 'app-account-clinical-history',
  standalone: true,
  imports: [CommonModule, BootstrapModule],
  templateUrl: './account-clinical-history.component.html',
  styleUrls: ['./account-clinical-history.component.scss']
})
export class AccountClinicalHistoryComponent {
  accountService = inject(AccountService);
}
