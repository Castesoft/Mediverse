import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PasswordResetForm } from 'src/app/_models/account';
import { FormErrorModalService } from 'src/app/_services/form-error-modal.service';
import { AccountService } from 'src/app/_services/account.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  selector: '[passwordResetForm]',
  templateUrl: './password-reset-form.component.html',
  standalone: true,
  imports: [ RouterModule, ReactiveFormsModule, FormsModule, InputControlComponent,  ],
})
export class PasswordResetFormComponent {
  private validation = inject(ValidationService);
  private errorModal = inject(FormErrorModalService);
  private accountService = inject(AccountService);
  private snackbarService = inject(SnackbarService)


  form = new PasswordResetForm();

  constructor() {
    effect(() => {
      this.form.setValidators(this.validation.active());
    });
  }

  onSubmit() {
    this.form.submitted = true;
    if (this.form.formGroup.valid) {
      this.accountService.sendEmailForPasswordReset(this.form.formGroup.get('email')?.value).subscribe(response => {
        this.snackbarService.success(`Correo de confirmación enviado`);
        this.form.formGroup.reset();
        this.form.submitted = false;
      });
    } else {
      this.errorModal.show();
    }
  }

}
