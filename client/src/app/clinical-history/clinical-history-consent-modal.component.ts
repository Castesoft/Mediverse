import { Component, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from "src/app/users/users.config";
import { User } from "src/app/_models/users/user";

export interface ClinicalHistoryConsentModalData {
  doctorId: number;
  patientId: number;
  currentConsent: boolean;
}

@Component({
  selector: 'div[clinicalHistoryConsentModal]',
  templateUrl: `./clinical-history-consent-modal.component.html`,
})
// TODO - Handle cases when consent is already given
// TODO - mismatch between SelectOption and string in User class
export class ClinicalHistoryConsentModalComponent {
  private readonly usersService: UsersService = inject(UsersService);

  readonly dialogRef: MatDialogRef<ClinicalHistoryConsentModalComponent> = inject(MatDialogRef);
  readonly data: ClinicalHistoryConsentModalData = inject(MAT_DIALOG_DATA);

  doctor: User | null = null;
  bodyText: string = '¿Estás seguro de que deseas compartir tu historial clínico con este doctor?';

  constructor() {
    effect(() => {
      if (this.data.doctorId) {
        this.usersService.getById(this.data.doctorId)
          .subscribe((user: User) => {
            this.doctor = user;
            if (user.sex as any === "Femenino") {
              this.bodyText = `¿Estás seguro de que deseas compartir tu historial clínico con la Dra. ${user.firstName}?`;
            } else {
              this.bodyText = `¿Estás seguro de que deseas compartir tu historial clínico con el Dr. ${user.firstName}?`;
            }
          });
      }
    })
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
