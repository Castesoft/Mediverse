import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  DeactivateConfirmationModalComponent
} from 'src/app/account/modals/deactivate-confirmation-modal/deactivate-confirmation-modal.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-card-deactivate',
  templateUrl: './card-deactivate.component.html',
  styleUrl: './card-deactivate.component.scss',
  imports: [ TemplateModule, FormsModule ],
})
export class CardDeactivateComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  isConfirmed: WritableSignal<boolean> = signal(false);
  accountService: AccountService = inject(AccountService);
  onSelectSection: OutputEmitterRef<string> = output<string>();

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  openConfirmationModal(): void {
    if (!this.isConfirmed()) return;

    const dialogRef: MatDialogRef<DeactivateConfirmationModalComponent> = this.dialog.open(DeactivateConfirmationModalComponent, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(
      filter(result => result === true)
    ).subscribe(() => {
      // TODO: Add post-deactivation logic (e.g., logout, redirect, show success message)
      this.accountService.logout();
    });
  }
}
