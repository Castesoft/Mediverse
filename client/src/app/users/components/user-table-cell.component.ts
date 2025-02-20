import { Component, effect, inject, input, InputSignal, ModelSignal, model, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClinicalHistoryConsentService } from 'src/app/_services/clinical-history-consent.service';
import { UsersService } from '../users.config';
import { Account } from "src/app/_models/account/account";
import { User } from "src/app/_models/users/user";
import { ClinicalHistoryVerification } from "src/app/_models/clinicalHistoryVerification";
import { RouterLink } from "@angular/router";
import { ProfilePictureComponent } from "src/app/users/components/profile-picture/profile-picture.component";
import {
  ClinicalHistoryConsentModalComponent,
  ClinicalHistoryConsentModalData
} from "src/app/clinical-history/clinical-history-consent-modal.component";

@Component({
  selector: 'td[userCell]',
  templateUrl: './user-table-cell.component.html',
  standalone: true,
  imports: [
    RouterLink,
    ProfilePictureComponent
  ]
})
export class UserTableCellComponent<T extends User> implements OnInit {
  usersService: UsersService = inject(UsersService);
  consentService: ClinicalHistoryConsentService = inject(ClinicalHistoryConsentService);
  dialog: MatDialog = inject(MatDialog);

  user: ModelSignal<T> = model.required<T>();
  role: ModelSignal<string> = model.required<string>();

  patientId: InputSignal<number | null | undefined> = input<number | null | undefined>();
  shouldAskForClinicalHistoryShare: InputSignal<boolean> = input(false);

  consentStatus: boolean = false;
  routerLink?: string;

  account: Account | null = null;

  ngOnInit(): void {
    this.routerLink = `${this.usersService.dictionary.catalogRoute}/${this.user().id}`;
    if (this.shouldAskForClinicalHistoryShare() && this.role() === 'Doctor' && this.patientId()) {
      this.fetchConsentStatus();
    }
  }

  fetchConsentStatus(): void {
    this.consentService.getConsentStatus(this.user().id!, this.patientId()!)
      .subscribe((status: ClinicalHistoryVerification) => {
        this.consentStatus = status.hasAccess;
      });
  }

  openConsentModal(): void {
    const dialogData: ClinicalHistoryConsentModalData = {
      doctorId: this.user().id!,
      patientId: this.patientId()!,
      currentConsent: this.consentStatus
    };

    this.dialog.open(ClinicalHistoryConsentModalComponent, {
      data: dialogData,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.consentService.updateConsentStatus(this.user().id!, this.patientId()!, !this.consentStatus)
          .subscribe((updatedStatus: ClinicalHistoryVerification) => {
            this.consentStatus = updatedStatus.hasAccess;
          });
      }
    });
  }
}
