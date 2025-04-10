import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/_shared/material.module';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { finalize } from 'rxjs';
import { InputControlComponent } from 'src/app/_forms/input-control.component';


@Component({
  selector: 'app-deactivate-confirmation-modal',
  templateUrl: './deactivate-confirmation-modal.component.html',
  styleUrls: [ './deactivate-confirmation-modal.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    InputControlComponent
  ],
})
export class DeactivateConfirmationModalComponent {
  private readonly dialogRef: MatDialogRef<any> = inject(MatDialogRef<DeactivateConfirmationModalComponent, boolean>);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly accountService: AccountService = inject(AccountService);

  deactivationForm: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  constructor() {
    this.deactivationForm = this.fb.group({
      password: [ '', [ Validators.required ] ],
    });
  }

  confirmDeactivation(): void {
    if (this.deactivationForm.invalid) {
      this.deactivationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { password } = this.deactivationForm.value;


    this.accountService.deleteAccount(password).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Deactivation error:', err);
        this.errorMessage.set(err?.error || 'Ocurrió un error al intentar desactivar la cuenta. Verifica tu contraseña.');
      }
    });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
